import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { name, image, type } = await req.json();

    const result = db.prepare(`
      INSERT INTO skills (name, image, type)
      VALUES (?, ?, ?)
    `).run(name, image, type);

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Error inserting skill:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing skill ID' }, { status: 400 });
    }

    db.prepare('DELETE FROM skills WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
