import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { defaultTemplates } from '@/data/templates';
import { generateImageWithGemini, isGeminiImageConfigured } from '@/lib/ai-image';
import {
  isSupabaseConfigured,
  getBusiness as storeGetBusiness,
  getGeneratedCopy as storeGetGeneratedCopy,
  createGeneratedImage as storeCreateGeneratedImage,
} from '@/lib/store';

/**
 * Generate a poster image using Gemini or return template data for client-side rendering
 */
async function generateImage(
  serviceName: string,
  description: string,
  whatYouDo: string,
  ownerName: string | null,
  reviewText: string,
  templateStyle: string,
  width: number,
  height: number,
): Promise<string> {
  if (isGeminiImageConfigured()) {
    return await generateImageWithGemini({
      serviceName,
      description,
      whatYouDo,
      ownerName,
      reviewText,
      templateStyle,
      width,
      height,
    });
  }
  // No Gemini API key - return empty string (client will fall back to html-to-image)
  return '';
}

// POST /api/generate-image - Generate review image
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { template_id, generated_copy_id, business_id, size_preset } = body;

  if (!template_id || !generated_copy_id || !business_id) {
    return NextResponse.json(
      { error: 'テンプレートID、口コミID、事業者IDは必須です' },
      { status: 400 }
    );
  }

  const template = defaultTemplates.find(t => t.id === template_id);
  if (!template) {
    return NextResponse.json({ error: 'テンプレートが見つかりません' }, { status: 404 });
  }

  const selectedPreset = template.size_presets.find(p => p.label === size_preset)
    || template.size_presets[0];

  if (!isSupabaseConfigured()) {
    const business = storeGetBusiness(business_id);
    if (!business) {
      return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
    }

    const copy = storeGetGeneratedCopy(generated_copy_id);
    if (!copy) {
      return NextResponse.json({ error: '口コミ文が見つかりません' }, { status: 404 });
    }

    try {
      const imageDataUrl = await generateImage(
        business.service_name,
        business.description,
        business.what_you_do,
        business.owner_name || null,
        copy.review_text,
        template.name,
        selectedPreset.width,
        selectedPreset.height,
      );

      const image = storeCreateGeneratedImage({
        business_id,
        template_id,
        generated_copy_id,
        image_url: imageDataUrl,
        is_public: false,
      });

      return NextResponse.json({
        image,
        template,
        business,
        copy,
        size: selectedPreset,
        generated_image_url: imageDataUrl || null,
      }, { status: 201 });
    } catch (error) {
      console.error('Image generation error:', error);
      // Fallback: return data without generated image
      const image = storeCreateGeneratedImage({
        business_id,
        template_id,
        generated_copy_id,
        image_url: '',
        is_public: false,
      });

      return NextResponse.json({
        image,
        template,
        business,
        copy,
        size: selectedPreset,
        generated_image_url: null,
      }, { status: 201 });
    }
  }

  // Supabase path
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', business_id)
    .single();

  if (!business) {
    return NextResponse.json({ error: '事業者が見つかりません' }, { status: 404 });
  }

  const { data: copy } = await supabase
    .from('generated_copies')
    .select('*')
    .eq('id', generated_copy_id)
    .single();

  if (!copy) {
    return NextResponse.json({ error: '口コミ文が見つかりません' }, { status: 404 });
  }

  let imageDataUrl = '';
  try {
    imageDataUrl = await generateImage(
      business.service_name,
      business.description,
      business.what_you_do,
      business.owner_name || null,
      copy.review_text,
      template.name,
      selectedPreset.width,
      selectedPreset.height,
    );
  } catch (error) {
    console.error('Image generation error:', error);
  }

  const { data: image, error: dbError } = await supabase
    .from('generated_images')
    .insert({
      business_id,
      template_id,
      generated_copy_id,
      image_url: imageDataUrl,
      is_public: false,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    image,
    template,
    business,
    copy,
    size: selectedPreset,
    generated_image_url: imageDataUrl || null,
  }, { status: 201 });
}
