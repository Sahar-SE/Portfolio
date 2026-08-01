import { neon } from '@neondatabase/serverless';

// sql is an async tagged-template function — use it like:
//   const { rows } = await sql`SELECT * FROM projects`
const sql = neon(process.env.DATABASE_URL!);

// Initialize schema + seed data once per cold start
let initialized = false;

export async function initDb() {
  if (initialized) return;
  initialized = true;

  // ── Create tables in parallel ──────────────────────────────────
  await Promise.all([
    sql`
      CREATE TABLE IF NOT EXISTS projects (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        description TEXT NOT NULL,
        devs        TEXT NOT NULL,
        tags        TEXT NOT NULL,
        image       TEXT NOT NULL,
        link        TEXT NOT NULL,
        "srcLink"   TEXT NOT NULL
      )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS skills (
        id    SERIAL PRIMARY KEY,
        name  TEXT NOT NULL,
        image TEXT NOT NULL,
        type  TEXT NOT NULL
      )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS config (
        key   TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `,
    sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id    SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        image TEXT NOT NULL,
        url   TEXT
      )
    `
  ]);

  // ── Fetch counts in parallel to check seeding needs ────────────
  const [pRows, sRows, cRows, certRows] = await Promise.all([
    sql`SELECT COUNT(*) AS count FROM projects`,
    sql`SELECT COUNT(*) AS count FROM skills`,
    sql`SELECT COUNT(*) AS count FROM config WHERE key = 'resume'`,
    sql`SELECT COUNT(*) AS count FROM certificates`
  ]);

  const seedPromises: Promise<any>[] = [];

  // Seed projects
  if (parseInt(pRows[0].count) === 0) {
    seedPromises.push(
      sql`
        INSERT INTO projects (title, description, devs, tags, image, link, "srcLink") VALUES
        (
          'Hotel Reservation',
          'This application is a web application for final capstone project that you can find your favorite Hotel around the world and reserve it for a specific date, find information about a hotel at details page and cancel a reservation.',
          ${JSON.stringify(['frontend', 'backend', '2022'])},
          ${JSON.stringify(['html', 'css', 'React/Redux', 'Ruby on Rails'])},
          '/img/Snapshoot.png',
          'https://hotel-reservation-i2st.onrender.com/',
          'https://github.com/Sahar-SE/hotel-reservation'
        ),
        (
          'Media Hub',
          'In this project, we developed an application that displays movies and allows users to like and comment on their favorite movies. The application is built on HTML, CSS and JavaScript.',
          ${JSON.stringify(['HTML/CSS', 'JavaScript', '2022'])},
          ${JSON.stringify(['html', 'css', 'javascript', 'Bootstrap'])},
          '/img/Snapshoot(1).png',
          'https://sahar-se.github.io/MediaHub/',
          'https://github.com/Sahar-SE/MediaHub'
        ),
        (
          'Weather App',
          'This is a SPA react-app project that is built using two APIs. And users can select and choose countries and states and get their updated weather info. I have built this project using react-redux and JavaScript.',
          ${JSON.stringify(['React', 'Redux', '2021'])},
          ${JSON.stringify(['html', 'css', 'React/Redux', 'API'])},
          '/img/Snapshoot(2).png',
          'https://stellar-pithivier-09ad04.netlify.app/',
          'https://github.com/Sahar-SE/sakwa-weather-app'
        )
      `
    );
  }

  // Seed skills
  if (parseInt(sRows[0].count) === 0) {
    seedPromises.push(
      sql`
        INSERT INTO skills (name, image, type) VALUES
        ('JavaScript', '/img/Ellipse.png',    'language'),
        ('HTML',       '/img/Ellipse(1).png', 'language'),
        ('CSS',        '/img/Ellipse(2).png', 'language'),
        ('Ruby',       '/img/ruby.png',       'language'),
        ('MySQL',      '/img/mysql.png',      'language'),
        ('Bootstrap',  '/img/bootstrap.png',  'framework'),
        ('React',      '/img/react.png',      'framework'),
        ('Rails',      '/img/rails.png',      'framework'),
        ('Tailwind',   '/img/tailwind.png',   'framework')
      `
    );
  }

  // Seed config
  if (parseInt(cRows[0].count) === 0) {
    seedPromises.push(
      sql`
        INSERT INTO config (key, value) VALUES
        ('resume', 'https://drive.google.com/file/d/1Lgaswupc8tNLWKjA05i1l4zTLhn77RLl/view?usp=sharing'),
        ('contacts', ${JSON.stringify({
          twitter:  'https://twitter.com/SaharSabaAmiri',
          linkedin: 'https://www.linkedin.com/in/sahar-saba-amiri/',
          email:    'saharsaba.amiri123@gmail.com',
          github:   'https://github.com/Sahar-SE',
          angel:    'https://angel.co/u/sahar-saba-amiri'
        })})
        ON CONFLICT (key) DO NOTHING
      `
    );
  }

  // Seed certificates
  if (parseInt(certRows[0].count) === 0) {
    seedPromises.push(
      sql`
        INSERT INTO certificates (title, image, url) VALUES
        (
          'Full Stack Web Development Program',
          '/img/bootstrap.png',
          'https://www.microverse.org/'
        ),
        (
          'Front-End Web Development Certificate',
          '/img/react.png',
          ''
        )
      `
    );
  }

  if (seedPromises.length > 0) {
    await Promise.all(seedPromises);
  }
}

export { sql };
