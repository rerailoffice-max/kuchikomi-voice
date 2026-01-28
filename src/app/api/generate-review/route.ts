import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateMockReview, validateReviewText } from '@/lib/mock-ai';
import { generateReviewWithGemini, isGeminiConfigured } from '@/lib/ai-review';
import {
  isSupabaseConfigured,
  getBusiness as storeGetBusiness,
  getSurveyResponse as storeGetSurveyResponse,
  getSurveyForBusiness as storeGetSurveyForBusiness,
  createGeneratedCopy as storeCreateGeneratedCopy,
} from '@/lib/store';

/**
 * Generate review text using Gemini or mock fallback
 */
async function generateReview(
  serviceName: string,
  description: string,
  whatYouDo: string,
  questions: Parameters<typeof generateMockReview>[3],
  answers: Parameters<typeof generateMockReview>[4],
  freeComment: string | null
): Promise<string> {
  if (isGeminiConfigured()) {
    try {
      return await generateReviewWithGemini(
        serviceName, description, whatYouDo, questions, answers, freeComment
      );
    } catch (error) {
      console.error('Gemini API error, falling back to mock:', error);
      return generateMockReview(serviceName, description, whatYouDo, questions, answers, freeComment);
    }
  }
  return generateMockReview(serviceName, description, whatYouDo, questions, answers, freeComment);
}

// POST /api/generate-review - Generate AI review text
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { survey_response_id, business_id } = body;

  if (!survey_response_id || !business_id) {
    return NextResponse.json(
      { error: 'アンケート回答IDと事業者IDは必須です' },
      { status: 400 }
    );
  }

  if (!isSupabaseConfigured()) {
    const business = storeGetBusiness(business_id);
    if (!business) {
      return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
    }

    const response = storeGetSurveyResponse(survey_response_id);
    if (!response) {
      return NextResponse.json({ error: '回答が見つかりません' }, { status: 404 });
    }

    const survey = storeGetSurveyForBusiness(business_id);
    if (!survey) {
      return NextResponse.json({ error: 'アンケート定義が見つかりません' }, { status: 404 });
    }

    const reviewText = await generateReview(
      business.service_name,
      business.description,
      business.what_you_do,
      survey.questions,
      response.answers,
      response.free_comment
    );

    const validation = validateReviewText(reviewText);

    const copy = storeCreateGeneratedCopy({
      survey_response_id,
      review_text: reviewText,
      status: 'draft',
    });

    return NextResponse.json({ copy, validation }, { status: 201 });
  }

  // Supabase path
  const { data: business, error: bizError } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', business_id)
    .single();

  if (bizError || !business) {
    return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
  }

  const { data: response, error: respError } = await supabase
    .from('survey_responses')
    .select('*')
    .eq('id', survey_response_id)
    .single();

  if (respError || !response) {
    return NextResponse.json({ error: '回答が見つかりません' }, { status: 404 });
  }

  const { data: survey } = await supabase
    .from('survey_definitions')
    .select('*')
    .eq('id', response.survey_definition_id)
    .single();

  if (!survey) {
    return NextResponse.json({ error: 'アンケート定義が見つかりません' }, { status: 404 });
  }

  const reviewText = await generateReview(
    business.service_name,
    business.description,
    business.what_you_do,
    survey.questions,
    response.answers,
    response.free_comment
  );

  const validation = validateReviewText(reviewText);

  const { data: copy, error: copyError } = await supabase
    .from('generated_copies')
    .insert({
      survey_response_id,
      review_text: reviewText,
      status: 'draft',
    })
    .select()
    .single();

  if (copyError) {
    return NextResponse.json({ error: copyError.message }, { status: 500 });
  }

  return NextResponse.json({ copy, validation }, { status: 201 });
}
