import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { title, description, devs, tags, image, link, srcLink } = await req.json();

    const result = db.prepare(`
      INSERT INTO projects (title, description, devs, tags, image, link, srcLink)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      description,
      JSON.stringify(devs || ['frontend', 'backend', '2022']),
      JSON.stringify(tags || []),
      image || '/img/Snapshoot.png',
      link,
      srcLink
    );

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error: any) {
    console.error('Error inserting project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, devs, tags, image, link, srcLink } = await req.json();

    db.prepare(`
      UPDATE projects
      SET title = ?, description = ?, devs = ?, tags = ?, image = ?, link = ?, srcLink = ?
      WHERE id = ?
    `).run(
      title,
      description,
      JSON.stringify(devs),
      JSON.stringify(tags),
      image,
      link,
      srcLink,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing project ID' }, { status: 400 });
    }

    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
