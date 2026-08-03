'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Skill {
  id?: number;
  name: string;
  image: string;
}

interface ContactEntry {
  url: string;
  icon?: string;
}

interface Contacts {
  [key: string]: ContactEntry | undefined;
}

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
  twitter: { url: 'https://twitter.com/SaharSabaAmiri' },
  linkedin: { url: 'https://www.linkedin.com/in/sahar-saba-amiri/' },
  email: { url: 'saharsaba.amiri123@gmail.com' },
  github: { url: 'https://github.com/Sahar-SE' },
  angel: { url: 'https://angel.co/u/sahar-saba-amiri' }
};

const DEFAULT_RESUME = 'https://drive.google.com/file/d/1Lgaswupc8tNLWKjA05i1l4zTLhn77RLl/view?usp=sharing';

const renderContactIcon = (key: string, customIcon?: string) => {
  if (customIcon) {
    return <img src={customIcon} alt={key} style={{ objectFit: 'contain', filter: 'none', opacity: 0.9 }} />;
  }

  const normalizedKey = key.toLowerCase();
  const standardIcons: Record<string, string> = {
    twitter: '/img/Vector.png',
    linkedin: '/img/Linkedin.png',
    email: '/img/Vector(1).png',
    github: '/img/Vector(2).png',
    angel: '/img/Vector(3).png',
  };

  if (standardIcons[normalizedKey]) {
    return <img src={standardIcons[normalizedKey]} alt={key} />;
  }

  const svgStyle = { width: '18px', height: '18px', fill: '#f0f0ff', opacity: 0.75 };
  if (normalizedKey === 'telegram') {
    return (
      <svg style={svgStyle} viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.11.02-1.89 1.2-5.33 3.52-.5.35-.96.52-1.37.51-.45-.01-1.32-.26-1.97-.47-.8-.26-1.43-.4-1.38-.85.03-.24.35-.48.97-.73 3.79-1.65 6.32-2.73 7.59-3.25 3.61-1.48 4.36-1.74 4.85-1.75.11 0 .35.03.5.16.13.12.17.29.19.41-.02.03-.02.13-.02.18z"/>
      </svg>
    );
  }
  if (normalizedKey === 'youtube') {
    return (
      <svg style={svgStyle} viewBox="0 0 24 24">
        <path d="M23.498 6.163c-.272-1.018-1.074-1.819-2.091-2.091C19.56 3.54 12 3.54 12 3.54s-7.56 0-9.407.532c-1.017.272-1.819 1.073-2.091 2.091C0 8.01 0 12 0 12s0 3.99.502 5.837c.272 1.018 1.074 1.819 2.091 2.091 1.847.532 9.407.532 9.407.532s7.56 0 9.408-.532c1.017-.272 1.819-1.073 2.091-2.091C24 15.99 24 12 24 12s0-3.99-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    );
  }
  if (normalizedKey === 'instagram') {
    return (
      <svg style={svgStyle} viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    );
  }
  return (
    <svg style={svgStyle} viewBox="0 0 24 24">
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
    </svg>
  );
};

export default function Home() {
  // Form handling state
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errorMsg, setErrorMsg] = useState('');

  // Database-driven States
  const [languages, setLanguages] = useState<Skill[]>(DEFAULT_LANGUAGES);
  const [frameworks, setFrameworks] = useState<Skill[]>(DEFAULT_FRAMEWORKS);
  const [contacts, setContacts] = useState<Contacts>(DEFAULT_CONTACTS);
  const [resume, setResume] = useState(DEFAULT_RESUME);

  // Fetch portfolio data from database API on mount with cache buster
  useEffect(() => {
    const loadPortfolioData = async () => {
      try {
        const res = await fetch(`/api/portfolio?minimal=true&t=${Date.now()}`);
        const data = await res.json();
        if (data.success) {
          if (data.languages && data.languages.length > 0) setLanguages(data.languages);
          if (data.frameworks && data.frameworks.length > 0) setFrameworks(data.frameworks);
          if (data.contacts) {
            const normalized: Contacts = {};
            for (const [k, v] of Object.entries(data.contacts)) {
              if (typeof v === 'string') {
                normalized[k] = { url: v };
              } else if (v && typeof v === 'object' && 'url' in v) {
                normalized[k] = { url: (v as any).url || '', icon: (v as any).icon };
              }
            }
            setContacts(normalized);
          }
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
            I'm a software developer. I specialize in building robust, interactive web applications, crafting custom API integrations, and styling responsive interfaces that feel premium. Look through my portfolio journey below.
          </p>
        </div>
        <div className="part2">
          <p className="p2">LET'S CONNECT</p>
          <ul className="icons-list">
            {Object.entries(contacts).map(([key, entry]) => {
              if (!entry || (!entry.url && !entry.icon)) return null;
              const { url = '', icon } = entry;
              const href = url ? (key.toLowerCase() === 'email' && !url.startsWith('mailto:') ? `mailto:${url}` : url) : '#';
              const isMail = key.toLowerCase() === 'email';
              const isVoid = !url;
              return (
                <li key={key}>
                  <a
                    href={href}
                    target={isMail || isVoid ? undefined : "_blank"}
                    rel={isMail || isVoid ? undefined : "noopener noreferrer"}
                  >
                    {renderContactIcon(key, icon)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* ─── Core Services Section ─── */}
      <section className="services-section">
        <div className="section-header">
          <h2 className="section-title">What I Do</h2>
          <div className="underline" style={{ margin: '8px auto 0', width: '80px' }} />
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon-wrap">💻</div>
            <h3 className="service-title">Full-Stack Development</h3>
            <p className="service-desc">
              Building interactive, responsive web applications and robust APIs using JavaScript, React, Ruby on Rails, and modern CSS/SQL configurations.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap">🤖</div>
            <h3 className="service-title">Applied AI Integration</h3>
            <p className="service-desc">
              Embedding state-of-the-art Large Language Models (LLMs) and custom prompt engineering flows directly into production web products.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap">🗂️</div>
            <h3 className="service-title">Retrieval-Augmented Generation (RAG)</h3>
            <p className="service-desc">
              Designing semantic search engines and vector database pipelines to deliver contextual data to LLMs with high precision.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap">⚙️</div>
            <h3 className="service-title">Agentic AI Orchestration</h3>
            <p className="service-desc">
              Constructing autonomous AI agents with structured output flows, cognitive planning loops, and programmatic tool execution capabilities.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap">📈</div>
            <h3 className="service-title">Project Management</h3>
            <p className="service-desc">
              Leading software development lifecycles with Agile workflows, scope definition, sprint planning, and cross-functional team collaborations.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon-wrap">🛡️</div>
            <h3 className="service-title">Quality Assurance & Testing</h3>
            <p className="service-desc">
              Implementing robust unit, integration, and end-to-end testing strategies alongside automated CI/CD audits to guarantee reliability.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Journey / Timeline Section ─── */}
      <section className="journey-section">
        <div className="section-header">
          <h2 className="section-title">My Journey</h2>
          <div className="underline" style={{ margin: '8px auto 0', width: '80px' }} />
        </div>

        <div className="timeline-container">
          <div className="timeline-line" />
          
          <div className="timeline-item left">
            <div className="timeline-dot" />
            <div className="timeline-card">
              <span className="timeline-date">2025 - 2026</span>
              <h3 className="timeline-title">AI Solutions & Agentic Orchestration</h3>
              <h4 className="timeline-subtitle">Autonomous Systems & RAG Architectures</h4>
              <p className="timeline-desc">
                Designing cognitive agent loops, tool calling mechanisms, and semantic search (RAG) pipelines. Integrating LLMs with vector stores to automate complex, multi-step workflow lifecycles.
              </p>
            </div>
          </div>

          <div className="timeline-item right">
            <div className="timeline-dot" />
            <div className="timeline-card">
              <span className="timeline-date">2023 - 2024</span>
              <h3 className="timeline-title">Full-Stack & Applied AI Developer</h3>
              <h4 className="timeline-subtitle">Next.js & API Integrations</h4>
              <p className="timeline-desc">
                Developing highly responsive web apps in Next.js, building secure backend APIs in Ruby on Rails, and implementing automated testing (QA) structures alongside project management tasks.
              </p>
            </div>
          </div>

          <div className="timeline-item left">
            <div className="timeline-dot" />
            <div className="timeline-card">
              <span className="timeline-date">2022</span>
              <h3 className="timeline-title">Full-Stack Foundations & Graduation</h3>
              <h4 className="timeline-subtitle">Microverse Collaborative Program</h4>
              <p className="timeline-desc">
                Acquired 1000+ hours of experience in software engineering, Agile frameworks, and team collaboration. Mastered data structures, React, Redux, Ruby on Rails, and database design.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Myself Section ─── */}
      <section id="about" className="about-section">
        <div className="about-container">
          <div className="about-card">
            <div className="about-info">
              <h2 className="aside-head">About Myself</h2>
              <div className="underline" style={{ width: '80px', margin: '4px 0 16px' }} />
              <p className="aside-para">
                I'm Sahar, a software developer. I help teams, startups, and clients build beautiful, interactive products. I focus on clean code structures, component modularity, and rich aesthetic interfaces. If you have an application you need designed or code written, check my CV or get in touch.
              </p>
            </div>
            
            <div className="about-actions">
              <p className="p2">LET'S CONNECT</p>
              <ul className="icons-list">
                {Object.entries(contacts).map(([key, entry]) => {
                  if (!entry || (!entry.url && !entry.icon)) return null;
                  const { url = '', icon } = entry;
                  const href = url ? (key.toLowerCase() === 'email' && !url.startsWith('mailto:') ? `mailto:${url}` : url) : '#';
                  const isMail = key.toLowerCase() === 'email';
                  const isVoid = !url;
                  return (
                    <li key={key}>
                      <a
                        href={href}
                        target={isMail || isVoid ? undefined : "_blank"}
                        rel={isMail || isVoid ? undefined : "noopener noreferrer"}
                      >
                        {renderContactIcon(key, icon)}
                      </a>
                    </li>
                  );
                })}
              </ul>
              {resume && (
                <a
                  href={resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', width: 'fit-content', marginTop: '4px' }}
                >
                  <button type="button" className="btn btn-primary">
                    See My Resume
                  </button>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Skills & Tech Stack Section ─── */}
      <section id="skills" className="skills-section">
        <div className="skills-container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 className="section-title">Skills & Tech Stack</h2>
            <div className="underline" style={{ margin: '8px auto 0', width: '80px' }} />
          </div>

          <div className="skills-grid">
            <div className="skills-category-card">
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
            </div>

            <div className="skills-category-card">
              <div className="texts">
                <h3>Frameworks/Libraries/Models</h3>
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
        </div>
      </section>

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
            <label style={{ width: '100%' }}>
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
            <label style={{ width: '100%' }}>
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
            <label style={{ width: '100%' }}>
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
        
        {/* Subtle link to access the admin panel */}
        <div style={{ marginTop: '40px', opacity: 0.2, transition: 'opacity 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.2'}>
          <Link href="/admin" style={{ fontSize: '12px', color: 'rgba(220, 220, 255, 0.6)', textDecoration: 'none', fontWeight: '500' }}>
            Admin Dashboard
          </Link>
        </div>
      </footer>
    </>
  );
}
