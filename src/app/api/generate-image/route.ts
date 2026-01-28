import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { defaultTemplates } from '@/data/templates';
import { generatePosterImageAsDataUrl, generateCatchCopy } from '@/lib/generate-poster';
import {
  isSupabaseConfigured,
  getBusiness as storeGetBusiness,
  getGeneratedCopy as storeGetGeneratedCopy,
  createGeneratedImage as storeCreateGeneratedImage,
} from '@/lib/store';

export interface PosterDebugOutput {
  templateId: string;
  templateName: string;
  width: number;
  height: number;
  catchCopy: string;
  method: 'satori';
}

// POST /api/generate-image - Generate review image using Satori (@vercel/og)
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

    // Satori (HTML→PNG) で画像生成
    let imageDataUrl = '';
    let posterDebug: PosterDebugOutput | null = null;

    try {
      imageDataUrl = await generatePosterImageAsDataUrl({
        serviceName: business.service_name,
        description: business.description,
        ownerName: business.owner_name || null,
        reviewText: copy.review_text,
        templateId: template.id,
        width: selectedPreset.width,
        height: selectedPreset.height,
        faceUrl: business.face_url || null,
        logoUrl: business.logo_url || null,
      });

      posterDebug = {
        templateId: template.id,
        templateName: template.name,
        width: selectedPreset.width,
        height: selectedPreset.height,
        catchCopy: generateCatchCopy(copy.review_text),
        method: 'satori',
      };
    } catch (error) {
      console.error('Satori image generation error:', error);
      return NextResponse.json({ error: '画像生成に失敗しました' }, { status: 500 });
    }

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
      prompt_debug: posterDebug,
    }, { status: 201 });
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

  // Satori (HTML→PNG) で画像生成
  let imageDataUrl = '';
  let posterDebug: PosterDebugOutput | null = null;

  try {
    imageDataUrl = await generatePosterImageAsDataUrl({
      serviceName: business.service_name,
      description: business.description,
      ownerName: business.owner_name || null,
      reviewText: copy.review_text,
      templateId: template.id,
      width: selectedPreset.width,
      height: selectedPreset.height,
      faceUrl: business.face_url || null,
      logoUrl: business.logo_url || null,
    });

    posterDebug = {
      templateId: template.id,
      templateName: template.name,
      width: selectedPreset.width,
      height: selectedPreset.height,
      catchCopy: generateCatchCopy(copy.review_text),
      method: 'satori',
    };
  } catch (error) {
    console.error('Satori image generation error:', error);
    return NextResponse.json({ error: '画像生成に失敗しました' }, { status: 500 });
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
    prompt_debug: posterDebug,
  }, { status: 201 });
}
