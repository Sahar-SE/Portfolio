import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── POST: Add new skill ──────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await initDb();
    const { name, image, type } = await req.json();

    const rows = await sql`
      INSERT INTO skills (name, image, type)
      VALUES (${name}, ${image}, ${type})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error: any) {
    console.error('Error inserting skill:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE: Remove a skill ───────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing skill ID' }, { status: 400 });
    }

    await sql`DELETE FROM skills WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
