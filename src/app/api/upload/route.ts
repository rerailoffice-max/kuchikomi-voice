import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
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

    const parts = file.type.split('/');
    const ext = parts[1] === 'jpeg' ? 'jpg' : parts[1];
    const prefix = fileType || 'file';
    const fileName = prefix + '-' + uuidv4() + '.' + ext;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const url = '/uploads/' + fileName;

    return NextResponse.json({ url, fileName }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'アップロードに失敗しました' }, { status: 500 });
  }
}
