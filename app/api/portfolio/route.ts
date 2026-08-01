import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await initDb();

    // Get projects
    const rawProjects = await sql`SELECT * FROM projects ORDER BY id`;
    const projects = rawProjects.map((p: any) => ({
      ...p,
      devs: JSON.parse(p.devs),
      tags: JSON.parse(p.tags)
    }));

    // Get skills
    const rawSkills = await sql`SELECT * FROM skills ORDER BY id`;
    const languages  = rawSkills.filter((s: any) => s.type === 'language');
    const frameworks = rawSkills.filter((s: any) => s.type === 'framework');

    // Get config
    const resumeRow   = await sql`SELECT value FROM config WHERE key = 'resume'`;
    const contactsRow = await sql`SELECT value FROM config WHERE key = 'contacts'`;

    const resume   = resumeRow[0]?.value ?? '';
    const contacts = contactsRow[0] ? JSON.parse(contactsRow[0].value) : {};

    return NextResponse.json({ success: true, projects, languages, frameworks, contacts, resume });
  } catch (error: any) {
    console.error('Error fetching database data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
