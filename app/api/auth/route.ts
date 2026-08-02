import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// ── POST: Verify admin password against server-side env var ──────
// The ADMIN_PASSWORD env var is NEVER sent to the browser.
// Only a boolean result is returned to the client.
export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD env var is not set.');
      return NextResponse.json(
        { success: false, error: 'Server misconfiguration: ADMIN_PASSWORD is not configured.' },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    // Artificial delay to slow down brute-force attempts
    await new Promise(r => setTimeout(r, 500));
    return NextResponse.json({ success: false, error: 'Incorrect password.' }, { status: 401 });
  } catch {
    return NextResponse.json({ success: false, error: 'Bad request.' }, { status: 400 });
  }
}
