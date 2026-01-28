import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import {
  isSupabaseConfigured,
  listBusinesses as storeListBusinesses,
  createBusiness as storeCreateBusiness,
  createSurveyDefinition as storeCreateSurveyDefinition,
} from '@/lib/store';

// GET /api/businesses - List all businesses
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  if (!isSupabaseConfigured()) {
    const data = storeListBusinesses(search || undefined, category || undefined);
    return NextResponse.json(data);
  }

  let query = supabase
    .from('businesses')
    .select('id, service_name, description, what_you_do, category, logo_url, face_url, is_public_gallery, created_at')
    .order('created_at', { ascending: false });

  if (search) {
    query = query.or(`service_name.ilike.%${search}%,description.ilike.%${search}%`);
  }

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST /api/businesses - Register a new business
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { service_name, description, what_you_do, category, owner_name, logo_url, face_url, questions } = body;

  if (!service_name || !description || !what_you_do) {
    return NextResponse.json(
      { error: 'サービス名、概要、提供内容は必須です' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    const business = storeCreateBusiness({
      service_name,
      description,
      what_you_do,
      category: category || 'その他',
      owner_name: owner_name || null,
      logo_url: logo_url || null,
      face_url: face_url || null,
    });

    const surveyQuestions = questions || getDefaultQuestions();
    storeCreateSurveyDefinition({
      business_id: business.id,
      version: 1,
      questions: surveyQuestions,
    });

    return NextResponse.json({
      business,
      admin_url: `/business/manage/${business.admin_token}`,
      admin_token: business.admin_token,
    }, { status: 201 });
  }

  const adminToken = uuidv4();

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .insert({
      service_name,
      description,
      what_you_do,
      category: category || 'その他',
      owner_name: owner_name || null,
      logo_url: logo_url || null,
      face_url: face_url || null,
      admin_token: adminToken,
      is_public_gallery: false,
    })
    .select()
    .single();

  if (bizError) {
    return NextResponse.json({ error: bizError.message }, { status: 500 });
  }

  const surveyQuestions = questions || getDefaultQuestions();

  const { error: surveyError } = await supabase
    .from('survey_definitions')
    .insert({
      business_id: business.id,
      version: 1,
      questions: surveyQuestions,
    });

  if (surveyError) {
    return NextResponse.json({ error: surveyError.message }, { status: 500 });
  }

  return NextResponse.json({
    business,
    admin_url: `/business/manage/${adminToken}`,
    admin_token: adminToken,
  }, { status: 201 });
}

function getDefaultQuestions() {
  return [
    {
      id: uuidv4(),
      type: 'rating',
      label: '満足度はいかがでしたか？',
      required: true,
      min: 1,
      max: 5,
    },
    {
      id: uuidv4(),
      type: 'multi_select',
      label: '良かった点を教えてください',
      required: true,
      options: ['説明が丁寧', '技術が高い', '接客が良い', '通いやすい', '価格が適正', '清潔感がある'],
    },
    {
      id: uuidv4(),
      type: 'free_text',
      label: 'その他、感想やメッセージがあればお聞かせください',
      required: false,
    },
  ];
}
