import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { resume, contacts } = await req.json();

    if (resume !== undefined) {
      db.prepare(`
        INSERT INTO config (key, value)
        VALUES ('resume', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(resume);
    }

    if (contacts !== undefined) {
      db.prepare(`
        INSERT INTO config (key, value)
        VALUES ('contacts', ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
      `).run(JSON.stringify(contacts));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
