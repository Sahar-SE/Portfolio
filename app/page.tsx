'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Project {
  id?: number;
  title: string;
  devs: string[];
  description: string;
  tags: string[];
  image: string;
  liveVersion: string;
  sourceLink: string;
  link: string;
  srcLink: string;
}

interface Skill {
  id?: number;
  name: string;
  image: string;
}

interface Contacts {
  twitter: string;
  linkedin: string;
  email: string;
  github: string;
  angel: string;
}

// Fallback initial data
const DEFAULT_PROJECTS: Project[] = [
  {
    title: 'Hotel Reservation',
    devs: ['frontend', 'backend', '2022'],
    description:
      "This application is a web application for final capstone project that you can find your favorite Hotel around the world and reserve it for a specific date, find information about a hotel at details page and cancel a reservation.",
    tags: ['html', 'css', 'React/Redux', 'Ruby on Rails'],
    image: '/img/Snapshoot.png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    link: 'https://hotel-reservation-i2st.onrender.com/',
    srcLink: 'https://github.com/Sahar-SE/hotel-reservation'
  },
  {
    title: 'Media Hub',
    devs: ['HTML/CSS', 'JavaScript', '2022'],
    description:
      "In this project, we developed an application that displays movies and allows users to like and comment on their favorite movies. The application is built on HTML, CSS and JavaScript.",
    tags: ['html', 'css', 'javascript', 'Bootstrap'],
    image: '/img/Snapshoot(1).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    link: 'https://sahar-se.github.io/MediaHub/',
    srcLink: 'https://github.com/Sahar-SE/MediaHub',
  },
  {
    title: 'Weather App',
    devs: ['React', 'Redux', '2021'],
    description:
      "This is a SPA react-app project that is built using two APIs. And users can select and choose countries and states and get their updated weather info. I have built this project using react-redux and JavaScript.",
    tags: ['html', 'css', 'React/Redux', 'API'],
    image: '/img/Snapshoot(2).png',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    link: 'https://stellar-pithivier-09ad04.netlify.app/',
    srcLink: 'https://github.com/Sahar-SE/sakwa-weather-app',
  }
];

const DEFAULT_LANGUAGES: Skill[] = [
  { name: 'JavaScript', image: '/img/Ellipse.png' },
  { name: 'HTML', image: '/img/Ellipse(1).png' },
  { name: 'CSS', image: '/img/Ellipse(2).png' },
  { name: 'Ruby', image: '/img/ruby.png' },
  { name: 'MySQL', image: '/img/mysql.png' }
];

const DEFAULT_FRAMEWORKS: Skill[] = [
  { name: 'Bootstrap', image: '/img/bootstrap.png' },
  { name: 'React', image: '/img/react.png' },
  { name: 'Rails', image: '/img/rails.png' },
  { name: 'Tailwind', image: '/img/tailwind.png' }
];

const DEFAULT_CONTACTS: Contacts = {
  twitter: 'https://twitter.com/SaharSabaAmiri',
  linkedin: 'https://www.linkedin.com/in/sahar-saba-amiri/',
  email: 'saharsaba.amiri123@gmail.com',
  github: 'https://github.com/Sahar-SE',
  angel: 'https://angel.co/u/sahar-saba-amiri'
};

const DEFAULT_RESUME = 'https://drive.google.com/file/d/1Lgaswupc8tNLWKjA05i1l4zTLhn77RLl/view?usp=sharing';

export default function Home() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Form handling state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // Database-driven States
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [languages, setLanguages] = useState<Skill[]>(DEFAULT_LANGUAGES);
  const [frameworks, setFrameworks] = useState<Skill[]>(DEFAULT_FRAMEWORKS);
  const [contacts, setContacts] = useState<Contacts>(DEFAULT_CONTACTS);
  const [resume, setResume] = useState(DEFAULT_RESUME);

  // Fetch portfolio data from database API on mount
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const res = await fetch('/api/portfolio');
        const data = await res.json();
        if (data.success) {
          if (data.projects && data.projects.length > 0) setProjects(data.projects);
          if (data.languages && data.languages.length > 0) setLanguages(data.languages);
          if (data.frameworks && data.frameworks.length > 0) setFrameworks(data.frameworks);
          if (data.contacts) setContacts(data.contacts);
          if (data.resume) setResume(data.resume);
        }
      } catch (err) {
        console.error('Failed to load portfolio database data:', err);
      }
    };
    loadPortfolioData();
  }, []);

  // Load draft from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('contact_draft');
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Sync to localStorage
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const updated = { ...formData, [id]: value };
    setFormData(updated);
    localStorage.setItem('contact_draft', JSON.stringify(updated));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (formData.email !== formData.email.toLowerCase()) {
      setErrorMsg('Please put your email characters in lowercase!');
      e.preventDefault();
      return;
    }
    setErrorMsg('');
    localStorage.setItem(formData.name, JSON.stringify({ email: formData.email, message: formData.message }));
  };

  return (
    <>
      {/* ─── Hero Section ─── */}
      <main>
        <div className="part1">
          <h1 className="head">
            I am Sahar Saba Amiri
            <br />
            <span className="gradient-text">Glad to see you!</span>
          </h1>
          <p className="p1">
            I'm a software developer. I can help you build a product, feature, or website. Look through some of my work and experience — if you like what you see and have a project you need coded, don't hesitate to contact me.
          </p>
        </div>
        <div className="part2">
          <p className="p2">LET's CONNECT</p>
          <ul className="icons-list">
            {contacts.twitter && (
              <li>
                <a href={contacts.twitter} target="_blank" rel="noopener noreferrer">
                  <img src="/img/Vector.png" alt="Twitter" />
                </a>
              </li>
            )}
            {contacts.linkedin && (
              <li>
                <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
                  <img src="/img/Linkedin.png" alt="LinkedIn" />
                </a>
              </li>
            )}
            {contacts.email && (
              <li>
                <a href={`mailto:${contacts.email}`}>
                  <img src="/img/Vector(1).png" alt="Email" />
                </a>
              </li>
            )}
            {contacts.github && (
              <li>
                <a href={contacts.github} target="_blank" rel="noopener noreferrer">
                  <img src="/img/Vector(2).png" alt="GitHub" />
                </a>
              </li>
            )}
            {contacts.angel && (
              <li>
                <a href={contacts.angel} target="_blank" rel="noopener noreferrer">
                  <img src="/img/Vector(3).png" alt="Wellfound" />
                </a>
              </li>
            )}
          </ul>
        </div>
      </main>

      {/* ─── Portfolio Cards ─── */}
      <div className="cards" id="portfolio">
        {projects.map((p, idx) => (
          <section key={p.id || idx} className={`card ${idx % 2 === 1 ? 'card2' : ''}`}>
            <div className="card-img">
              <img src={p.image} alt={p.title} />
            </div>
            <div className="card-contents">
              <h2 className="card-head">{p.title}</h2>
              <ul className="list">
                <li className="brand">Front End</li>
                <li>
                  <img src="/img/Counter.png" alt="Counter" />
                  {p.devs[1] || 'backend'}
                </li>
                <li>
                  <img src="/img/Counter.png" alt="Counter" />
                  {p.devs[2] || '2022'}
                </li>
              </ul>
              <p className="cards-para">{p.description}</p>
              <ul className="languages">
                {p.tags.map((tag, tIdx) => (
                  <li key={tIdx}>{tag}</li>
                ))}
              </ul>
              <button
                type="button"
                className="btn"
                onClick={() => setActiveProject(p)}
              >
                See Project
              </button>
            </div>
          </section>
        ))}
      </div>

      {/* ─── About Myself Section ─── */}
      <aside id="about">
        <div className="aside-contents">
          <div className="about">
            <h2 className="aside-head">About Myself</h2>
            <p className="aside-para">
              I'm a software developer! I can help you build a product, feature, or website. Look through some of my work and experience! If you like what you see and have a project you need coded, don't hesitate to contact me.
            </p>
            <p className="p2">LET's CONNECT</p>
            <ul className="icons-list">
              {contacts.twitter && (
                <li>
                  <a href={contacts.twitter} target="_blank" rel="noopener noreferrer">
                    <img src="/img/Vector.png" alt="Twitter" />
                  </a>
                </li>
              )}
              {contacts.linkedin && (
                <li>
                  <a href={contacts.linkedin} target="_blank" rel="noopener noreferrer">
                    <img src="/img/Linkedin.png" alt="LinkedIn" />
                  </a>
                </li>
              )}
              {contacts.email && (
                <li>
                  <a href={`mailto:${contacts.email}`}>
                    <img src="/img/Vector(1).png" alt="Email" />
                  </a>
                </li>
              )}
              {contacts.github && (
                <li>
                  <a href={contacts.github} target="_blank" rel="noopener noreferrer">
                    <img src="/img/Vector(2).png" alt="GitHub" />
                  </a>
                </li>
              )}
              {contacts.angel && (
                <li>
                  <a href={contacts.angel} target="_blank" rel="noopener noreferrer">
                    <img src="/img/Vector(3).png" alt="Wellfound" />
                  </a>
                </li>
              )}
            </ul>
            {resume && (
              <a
                href={resume}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', width: 'fit-content', marginTop: '12px' }}
              >
                <button type="button" className="btn btn-primary">
                  See My Resume
                </button>
              </a>
            )}
          </div>

          <div className="skills">
            <div className="texts">
              <h3>Languages</h3>
              <div className="underline" />
            </div>
            <div className="badges">
              {languages.map((l, idx) => (
                <div className="badge" key={l.id || idx}>
                  {l.image && <img src={l.image} alt={l.name} />}
                  <p>{l.name}</p>
                </div>
              ))}
            </div>

            <div className="texts">
              <h3>Frameworks</h3>
              <div className="underline" />
            </div>
            <div className="badges">
              {frameworks.map((f, idx) => (
                <div className="badge" key={f.id || idx}>
                  {f.image && <img src={f.image} alt={f.name} />}
                  <p>{f.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Contact Form Footer ─── */}
      <footer id="contact">
        <h2 className="footer-head">Contact Me</h2>
        <p className="footer-para">
          If you have an application you are interested in developing, a feature that you need built or a project that needs coding. I'd love to help with it.
        </p>
        <div className="decription">
          <form
            action="https://formspree.io/f/mbjwpoar"
            id="contact-form"
            method="post"
            onSubmit={handleFormSubmit}
          >
            <label>
              <input
                id="name"
                type="text"
                name="user"
                placeholder="Enter your name"
                maxLength={30}
                required
                value={formData.name}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your Email"
                maxLength={30}
                required
                value={formData.email}
                onChange={handleInputChange}
              />
            </label>
            <label>
              <textarea
                id="message"
                name="message"
                placeholder="Write your message here"
                maxLength={500}
                required
                value={formData.message}
                onChange={handleInputChange}
              />
            </label>
            {errorMsg && (
              <span style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', display: 'block', margin: '4px 0 8px' }}>
                {errorMsg}
              </span>
            )}
            <button id="submit" className="btn" type="submit">
              Get In Touch
            </button>
          </form>
        </div>
        <img src="/img/Shape.png" alt="sign" className="sign" />
        
        {/* Subtle, beautiful link in the footer to access the admin panel */}
        <div style={{ marginTop: '40px', opacity: 0.2, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.2'}>
          <Link href="/admin" style={{ fontSize: '12px', color: 'rgba(220, 220, 255, 0.6)', textDecoration: 'none', fontWeight: '500' }}>
            Admin Dashboard
          </Link>
        </div>
      </footer>

      {/* ─── Project Modal Popup ─── */}
      {activeProject && (
        <div className="popup-menus" onClick={() => setActiveProject(null)}>
          <div className="popup-main-container" onClick={(e) => e.stopPropagation()}>
            <div className="popup-content">
              <div className="popup-heading">
                <h1 className="popup-project1-title">{activeProject.title}</h1>
                <button
                  type="button"
                  className="popup-close"
                  onClick={() => setActiveProject(null)}
                >
                  &times;
                </button>
              </div>
              <ul className="popup-example-dev">
                <li className="dev1">• {activeProject.devs[0]}</li>
                <li className="dev2">• {activeProject.devs[1]}</li>
                <li className="dev2">• {activeProject.devs[2]}</li>
              </ul>
              <div className="popup-desktop">
                <div className="project-popup-img1">
                  <div className="popup-container-img">
                    <img src={activeProject.image} alt={activeProject.title} />
                  </div>
                </div>
                <div className="content-container">
                  <p className="project-popup-info1">{activeProject.description}</p>
                  <div className="project-popup-info2">
                    <ul className="popup-tags">
                      {activeProject.tags.map((tag, tIdx) => (
                        <li key={tIdx} className="popup-tag">
                          {tag}
                        </li>
                      ))}
                    </ul>
                    <div className="popup-button">
                      <a href={activeProject.link} target="_blank" rel="noopener noreferrer">
                        <button type="button" className="popup-button1">
                          {activeProject.liveVersion}
                          <img src="/img/Icone.png" alt="Live Icon" />
                        </button>
                      </a>
                      <a href={activeProject.srcLink} target="_blank" rel="noopener noreferrer">
                        <button type="button" className="popup-button1">
                          {activeProject.sourceLink}
                          <img src="/img/Vectors.png" alt="Source Icon" />
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
