import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import {
  isSupabaseConfigured,
  createSurveyResponse as storeCreateSurveyResponse,
} from '@/lib/store';

// POST /api/survey-responses - Submit survey response
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { business_id, survey_definition_id, answers, free_comment } = body;

  if (!business_id || !survey_definition_id || !answers) {
    return NextResponse.json(
      { error: '事業者ID、アンケート定義ID、回答は必須です' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    const data = storeCreateSurveyResponse({
      business_id,
      survey_definition_id,
      answers,
      free_comment: free_comment || null,
    });
    return NextResponse.json(data, { status: 201 });
  }

  const { data, error } = await supabase
    .from('survey_responses')
    .insert({
      business_id,
      survey_definition_id,
      answers,
      free_comment: free_comment || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
