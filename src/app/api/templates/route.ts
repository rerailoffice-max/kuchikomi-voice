import { NextResponse } from 'next/server';
import { defaultTemplates } from '@/data/templates';

// GET /api/templates - List all templates
export async function GET() {
  return NextResponse.json(defaultTemplates);
}
