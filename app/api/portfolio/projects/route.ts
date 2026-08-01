import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── POST: Add new project ────────────────────────────────────────
export async function POST(req: Request) {
  try {
    await initDb();
    const { title, description, devs, tags, image, link, srcLink } = await req.json();

    const rows = await sql`
      INSERT INTO projects (title, description, devs, tags, image, link, "srcLink")
      VALUES (
        ${title},
        ${description},
        ${JSON.stringify(devs || ['frontend', 'backend', '2022'])},
        ${JSON.stringify(tags || [])},
        ${image || '/img/Snapshoot.png'},
        ${link},
        ${srcLink}
      )
      RETURNING id
    `;

    return NextResponse.json({ success: true, id: rows[0].id });
  } catch (error: any) {
    console.error('Error inserting project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── PUT: Update existing project ─────────────────────────────────
export async function PUT(req: Request) {
  try {
    await initDb();
    const { id, title, description, devs, tags, image, link, srcLink } = await req.json();

    await sql`
      UPDATE projects
      SET
        title       = ${title},
        description = ${description},
        devs        = ${JSON.stringify(devs)},
        tags        = ${JSON.stringify(tags)},
        image       = ${image},
        link        = ${link},
        "srcLink"   = ${srcLink}
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ── DELETE: Remove a project ─────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing project ID' }, { status: 400 });
    }

    await sql`DELETE FROM projects WHERE id = ${parseInt(id)}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
