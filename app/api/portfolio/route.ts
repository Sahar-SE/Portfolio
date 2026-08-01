import { NextResponse } from 'next/server';
import { sql, initDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await initDb();
    const { searchParams } = new URL(req.url);
    const minimal = searchParams.get('minimal') === 'true';

    // Get skills
    const rawSkills = await sql`SELECT * FROM skills ORDER BY id`;
    const languages  = rawSkills.filter((s: any) => s.type === 'language');
    const frameworks = rawSkills.filter((s: any) => s.type === 'framework');

    // Get config
    const resumeRow   = await sql`SELECT value FROM config WHERE key = 'resume'`;
    const contactsRow = await sql`SELECT value FROM config WHERE key = 'contacts'`;

    const resume   = resumeRow[0]?.value ?? '';
    const contacts = contactsRow[0] ? JSON.parse(contactsRow[0].value) : {};

    let projects: any[] = [];
    let certificates: any[] = [];

    if (!minimal) {
      // Get projects
      const rawProjects = await sql`SELECT * FROM projects ORDER BY id`;
      projects = rawProjects.map((p: any) => ({
        ...p,
        devs: JSON.parse(p.devs),
        tags: JSON.parse(p.tags)
      }));

      // Get certificates
      certificates = await sql`SELECT * FROM certificates ORDER BY id`;
    }

    return NextResponse.json({ success: true, projects, languages, frameworks, contacts, resume, certificates });
  } catch (error: any) {
    console.error('Error fetching database data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
