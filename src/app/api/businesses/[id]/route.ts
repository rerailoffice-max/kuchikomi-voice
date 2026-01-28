import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  isSupabaseConfigured,
  getBusiness,
  getBusinessByToken,
  updateBusiness as storeUpdateBusiness,
  getSurveyForBusiness,
  createSurveyDefinition as storeCreateSurveyDefinition,
} from '@/lib/store';

// GET /api/businesses/[id] - Get business details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const isAdmin = request.nextUrl.searchParams.get('admin') === 'true';

  if (!isSupabaseConfigured()) {
    let business;
    if (isAdmin) {
      business = getBusinessByToken(id);
    } else {
      business = getBusiness(id);
    }

    if (!business) {
      return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
    }

    const survey = getSurveyForBusiness(business.id);
    return NextResponse.json({ business, survey });
  }

  let query;
  if (isAdmin) {
    query = supabase
      .from('businesses')
      .select('*')
      .eq('admin_token', id)
      .single();
  } else {
    query = supabase
      .from('businesses')
      .select('id, service_name, description, what_you_do, category, logo_url, face_url, is_public_gallery, created_at')
      .eq('id', id)
      .single();
  }

  const { data: business, error } = await query;

  if (error || !business) {
    return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
  }

  const { data: survey } = await supabase
    .from('survey_definitions')
    .select('*')
    .eq('business_id', business.id)
    .order('version', { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({ business, survey });
}

// PUT /api/businesses/[id] - Update business (admin token required)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = params.id;
  const body = await request.json();

  if (!isSupabaseConfigured()) {
    const existing = getBusinessByToken(token);
    if (!existing) {
      return NextResponse.json({ error: '権限がありません' }, { status: 403 });
    }

    const { service_name, description, what_you_do, category, owner_name, logo_url, face_url, is_public_gallery, questions } = body;
    const updateData: Record<string, unknown> = {};
    if (service_name !== undefined) updateData.service_name = service_name;
    if (description !== undefined) updateData.description = description;
    if (what_you_do !== undefined) updateData.what_you_do = what_you_do;
    if (category !== undefined) updateData.category = category;
    if (owner_name !== undefined) updateData.owner_name = owner_name;
    if (logo_url !== undefined) updateData.logo_url = logo_url;
    if (face_url !== undefined) updateData.face_url = face_url;
    if (is_public_gallery !== undefined) updateData.is_public_gallery = is_public_gallery;

    const business = storeUpdateBusiness(token, updateData);
    if (!business) {
      return NextResponse.json({ error: '更新に失敗しました' }, { status: 500 });
    }

    if (questions) {
      const currentSurvey = getSurveyForBusiness(business.id);
      const newVersion = (currentSurvey?.version || 0) + 1;
      storeCreateSurveyDefinition({
        business_id: business.id,
        version: newVersion,
        questions,
      });
    }

    return NextResponse.json({ business });
  }

  // Verify admin token
  const { data: existing } = await supabase
    .from('businesses')
    .select('id')
    .eq('admin_token', token)
    .single();

  if (!existing) {
    return NextResponse.json({ error: '権限がありません' }, { status: 403 });
  }

  const { service_name, description, what_you_do, category, owner_name, logo_url, face_url, is_public_gallery, questions } = body;

  const updateData: Record<string, unknown> = {};
  if (service_name !== undefined) updateData.service_name = service_name;
  if (description !== undefined) updateData.description = description;
  if (what_you_do !== undefined) updateData.what_you_do = what_you_do;
  if (category !== undefined) updateData.category = category;
  if (owner_name !== undefined) updateData.owner_name = owner_name;
  if (logo_url !== undefined) updateData.logo_url = logo_url;
  if (face_url !== undefined) updateData.face_url = face_url;
  if (is_public_gallery !== undefined) updateData.is_public_gallery = is_public_gallery;

  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .update(updateData)
    .eq('admin_token', token)
    .select()
    .single();

  if (bizError) {
    return NextResponse.json({ error: bizError.message }, { status: 500 });
  }

  if (questions) {
    const { data: currentSurvey } = await supabase
      .from('survey_definitions')
      .select('version')
      .eq('business_id', business.id)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const newVersion = (currentSurvey?.version || 0) + 1;

    await supabase
      .from('survey_definitions')
      .insert({
        business_id: business.id,
        version: newVersion,
        questions,
      });
  }

  return NextResponse.json({ business });
}
