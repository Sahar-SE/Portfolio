import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get projects
    const rawProjects = db.prepare('SELECT * FROM projects').all() as any[];
    const projects = rawProjects.map(p => ({
      ...p,
      devs: JSON.parse(p.devs),
      tags: JSON.parse(p.tags)
    }));

    // Get skills
    const rawSkills = db.prepare('SELECT * FROM skills').all() as any[];
    const languages = rawSkills.filter(s => s.type === 'language');
    const frameworks = rawSkills.filter(s => s.type === 'framework');

    // Get config (resume, contacts)
    const rawResume = db.prepare("SELECT value FROM config WHERE key = 'resume'").get() as { value: string };
    const rawContacts = db.prepare("SELECT value FROM config WHERE key = 'contacts'").get() as { value: string };

    const resume = rawResume ? rawResume.value : '';
    const contacts = rawContacts ? JSON.parse(rawContacts.value) : {};

    return NextResponse.json({
      success: true,
      projects,
      languages,
      frameworks,
      contacts,
      resume
    });
  } catch (error: any) {
    console.error('Error fetching database data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
