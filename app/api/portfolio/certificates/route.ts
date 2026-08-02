import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── GET: Retrieve certificates list ──────────────────────────────
export async function GET() {
  try {
    await initDb();
    const certificates = await sql`SELECT * FROM certificates ORDER BY id DESC`;
    return NextResponse.json({ success: true, certificates });
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PUT: Update an existing certificate ──────────────────────────
export async function PUT(req: Request) {
  try {
    await initDb();
    const { id, title, image, url, category } = await req.json();

    if (!id || !title || !image) {
      return NextResponse.json({ success: false, error: 'Missing id, title, or image' }, { status: 400 });
    }

    await sql`
      UPDATE certificates
      SET
        title    = ${title},
        image    = ${image},
        url      = ${url || ''},
        category = ${category || 'certificate'}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating certificate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── POST: Add a new certificate ──────────────────────────────────
export async function POST(req: Request) {
  try {
    await initDb();
    const { title, image, url, category } = await req.json();

    if (!title || !image) {
      return NextResponse.json({ success: false, error: 'Missing title or image' }, { status: 400 });
    }

    const rows = await sql`
      INSERT INTO certificates (title, image, url, category)
      VALUES (${title}, ${image}, ${url || ''}, ${category || 'certificate'})
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error: any) {
    console.error('Error inserting certificate:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE: Delete a certificate by ID ──────────────────────────
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
