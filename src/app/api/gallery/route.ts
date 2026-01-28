import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/store';

// GET /api/gallery - Get public gallery images
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    // Return empty gallery for in-memory mode (no images generated yet)
    return NextResponse.json([]);
  }

  const limit = Number(request.nextUrl.searchParams.get('limit') || '20');
  const offset = Number(request.nextUrl.searchParams.get('offset') || '0');

  const { data, error } = await supabase
    .from('generated_images')
    .select(`
      id,
      image_url,
      created_at,
      template_id,
      businesses (
        service_name,
        category
      ),
      generated_copies (
        review_text
      )
    `)
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
