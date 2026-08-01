import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

// ── POST: Update resume URL and/or contacts ──────────────────────
export async function POST(req: Request) {
  try {
    await initDb();
    const { resume, contacts } = await req.json();

    if (resume !== undefined) {
      await sql`
        INSERT INTO config (key, value) VALUES ('resume', ${resume})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    if (contacts !== undefined) {
      await sql`
        INSERT INTO config (key, value) VALUES ('contacts', ${JSON.stringify(contacts)})
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `;
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating config:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
