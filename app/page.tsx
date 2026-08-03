'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
            I'm a software developer. I specialize in building robust, interactive web applications, crafting custom API integrations, and styling responsive interfaces that feel premium. Look through my portfolio journey below.
          </p>
        </div>
        <div className="part2">
          <p className="p2">LET'S CONNECT</p>
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
