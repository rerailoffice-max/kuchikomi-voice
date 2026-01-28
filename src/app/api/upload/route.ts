import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { isSupabaseConfigured } from '@/lib/store';
import { v4 as uuidv4 } from 'uuid';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const fileType = formData.get('type') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'ファイルが選択されていません' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'JPG、PNG、WebP形式のみ対応しています' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }

    // ファイルをArrayBufferに変換
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Supabase が設定されている場合はStorageを使用
    if (isSupabaseConfigured()) {
      const parts = file.type.split('/');
      const ext = parts[1] === 'jpeg' ? 'jpg' : parts[1];
      const prefix = fileType || 'file';
      const fileName = `${prefix}-${uuidv4()}.${ext}`;

      const { error } = await supabase.storage
        .from('uploads')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        // Supabase Storageが失敗した場合はBase64フォールバック
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;
        return NextResponse.json({ url: dataUrl, fileName: `${fileType}-${uuidv4()}` }, { status: 201 });
      }

      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      return NextResponse.json({
        url: urlData.publicUrl,
        fileName: fileName,
      }, { status: 201 });
    }

    // Supabase未設定の場合：Base64 Data URLとして返す
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json({
      url: dataUrl,
      fileName: `${fileType || 'file'}-${uuidv4()}`,
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 });
  }
}
