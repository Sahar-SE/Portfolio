import Database from 'better-sqlite3';
import path from 'path';

// Resolve database file path in the workspace root
const dbPath = path.resolve(process.cwd(), 'portfolio.db');
const db = new Database(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    devs TEXT NOT NULL,
    tags TEXT NOT NULL,
    image TEXT NOT NULL,
    link TEXT NOT NULL,
    srcLink TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    image TEXT NOT NULL,
    type TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`);

// Seed default data if empty
const projectCount = db.prepare('SELECT COUNT(*) as count FROM projects').get() as { count: number };
if (projectCount.count === 0) {
  const insertProject = db.prepare(`
    INSERT INTO projects (title, description, devs, tags, image, link, srcLink)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    'Hotel Reservation',
    'This application is a web application for final capstone project that you can find your favorite Hotel around the world and reserve it for a specific date, find information about a hotel at details page and cancel a reservation.',
    JSON.stringify(['frontend', 'backend', '2022']),
    JSON.stringify(['html', 'css', 'React/Redux', 'Ruby on Rails']),
    '/img/Snapshoot.png',
    'https://hotel-reservation-i2st.onrender.com/',
    'https://github.com/Sahar-SE/hotel-reservation'
  );

  insertProject.run(
    'Media Hub',
    'In this project, we developed an application that displays movies and allows users to like and comment on their favorite movies. The application is built on HTML, CSS and JavaScript.',
    JSON.stringify(['HTML/CSS', 'JavaScript', '2022']),
    JSON.stringify(['html', 'css', 'javascript', 'Bootstrap']),
    '/img/Snapshoot(1).png',
    'https://sahar-se.github.io/MediaHub/',
    'https://github.com/Sahar-SE/MediaHub'
  );

  insertProject.run(
    'Weather App',
    'This is a SPA react-app project that is built using two APIs. And users can select and choose countries and states and get their updated weather info. I have built this project using react-redux and JavaScript.',
    JSON.stringify(['React', 'Redux', '2021']),
    JSON.stringify(['html', 'css', 'React/Redux', 'API']),
    '/img/Snapshoot(2).png',
    'https://stellar-pithivier-09ad04.netlify.app/',
    'https://github.com/Sahar-SE/sakwa-weather-app'
  );
}

const skillCount = db.prepare('SELECT COUNT(*) as count FROM skills').get() as { count: number };
if (skillCount.count === 0) {
  const insertSkill = db.prepare(`
    INSERT INTO skills (name, image, type)
    VALUES (?, ?, ?)
  `);

  // Languages
  insertSkill.run('JavaScript', '/img/Ellipse.png', 'language');
  insertSkill.run('HTML', '/img/Ellipse(1).png', 'language');
  insertSkill.run('CSS', '/img/Ellipse(2).png', 'language');
  insertSkill.run('Ruby', '/img/ruby.png', 'language');
  insertSkill.run('MySQL', '/img/mysql.png', 'language');

  // Frameworks
  insertSkill.run('Bootstrap', '/img/bootstrap.png', 'framework');
  insertSkill.run('React', '/img/react.png', 'framework');
  insertSkill.run('Rails', '/img/rails.png', 'framework');
  insertSkill.run('Tailwind', '/img/tailwind.png', 'framework');
}

const resumeConfig = db.prepare("SELECT COUNT(*) as count FROM config WHERE key = 'resume'").get() as { count: number };
if (resumeConfig.count === 0) {
  db.prepare("INSERT INTO config (key, value) VALUES ('resume', ?)").run(
    'https://drive.google.com/file/d/1Lgaswupc8tNLWKjA05i1l4zTLhn77RLl/view?usp=sharing'
  );
}

const contactsConfig = db.prepare("SELECT COUNT(*) as count FROM config WHERE key = 'contacts'").get() as { count: number };
if (contactsConfig.count === 0) {
  db.prepare("INSERT INTO config (key, value) VALUES ('contacts', ?)").run(
    JSON.stringify({
      twitter: 'https://twitter.com/SaharSabaAmiri',
      linkedin: 'https://www.linkedin.com/in/sahar-saba-amiri/',
      email: 'saharsaba.amiri123@gmail.com',
      github: 'https://github.com/Sahar-SE',
      angel: 'https://angel.co/u/sahar-saba-amiri'
    })
  );
}

export default db;
export { db };
