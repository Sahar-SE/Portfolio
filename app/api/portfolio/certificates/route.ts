import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── POST: Add a new certificate ──
export async function POST(req: Request) {
  try {
    await initDb();
    const { title, image, url } = await req.json();

    if (!title || !image) {
      return NextResponse.json({ success: false, error: 'Missing title or image' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO certificates (title, image, url)
      VALUES (${title}, ${image}, ${url || ''})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error: any) {
    console.error('Error inserting certificate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE: Delete a certificate by ID ──
export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing certificate ID' }, { status: 400 });
    }

    await sql`DELETE FROM certificates WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting certificate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
