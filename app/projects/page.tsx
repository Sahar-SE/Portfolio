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

export default function ProjectsCatalog() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch portfolio projects from Neon DB API on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/portfolio?t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.projects) {
          setProjects(data.projects);
          setFilteredProjects(data.projects);
        }
      } catch (err) {
        console.error('Failed to load portfolio database projects:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...projects];

    // Filter by tag/category
    if (activeFilter !== 'all') {
      result = result.filter(p => {
        const devsArray = Array.isArray(p.devs) ? p.devs : [];
        const tagsArray = Array.isArray(p.tags) ? p.tags : [];
        const devsLower = devsArray.map(d => String(d).toLowerCase());
        const tagsLower = tagsArray.map(t => String(t).toLowerCase());
        
        if (activeFilter === 'frontend') {
          return devsLower.includes('frontend') || devsLower.includes('front end') || tagsLower.includes('react') || tagsLower.includes('html') || tagsLower.includes('css');
        }
        if (activeFilter === 'backend') {
          return devsLower.includes('backend') || devsLower.includes('back end') || tagsLower.includes('rails') || tagsLower.includes('mysql') || tagsLower.includes('ruby');
        }
        if (activeFilter === 'fullstack') {
          return devsLower.includes('fullstack') || devsLower.includes('full stack') || (tagsLower.includes('react') && tagsLower.includes('rails'));
        }
        return false;
      });
    }

    // Search query logic
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => {
        const tagsArray = Array.isArray(p.tags) ? p.tags : [];
        return (
          p.title.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          tagsArray.some(tag => String(tag).toLowerCase().includes(q))
        );
      });
    }

    setFilteredProjects(result);
  }, [projects, searchQuery, activeFilter]);

  // Lock body scroll when popup details modal is open
  useEffect(() => {
    if (activeProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeProject]);

  return (
    <div className="projects-page-container">
      {/* ── Header Intro ── */}
      <section className="projects-header">
        <h1 className="projects-title">My Creative <span className="gradient-text">Portfolio</span></h1>
        <p className="projects-subtitle">
          A curated list of web applications, capstone projects, and experiments I've built using modern web standards.
        </p>
      </section>

      {/* ── Search & Filter Controls ── */}
      <div className="controls-bar">
        <div className="search-box">
          <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search projects by title, stack..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {[
            { id: 'all', label: 'All Projects' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
            { id: 'fullstack', label: 'Full Stack' }
          ].map(tab => (
            <button
              key={tab.id}
              className={`filter-tab ${activeFilter === tab.id ? 'active' : ''}`}
              onClick={() => setActiveFilter(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Catalog Projects Grid ── */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="loading-core" />
          </div>
          <p className="loading-text">Synchronizing creative nodes...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="empty-results">
          <p>No projects match your search query or filter selection.</p>
          <button className="btn" onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="cards" style={{ padding: '40px 0' }}>
          {filteredProjects.map((p, idx) => {
            const devsArray = Array.isArray(p.devs) ? p.devs : [];
            const tagsArray = Array.isArray(p.tags) ? p.tags : [];
            return (
              <section key={p.id || idx} className={`card ${idx % 2 === 1 ? 'card2' : ''}`}>
                <div className="card-img">
                  <img src={p.image} alt={p.title} />
                </div>
                <div className="card-contents">
                  <h2 className="card-head">{p.title}</h2>
                  <ul className="list">
                    <li className="brand">{devsArray[0] || 'Front End'}</li>
                    <li>
                      <img src="/img/Counter.png" alt="Counter" />
                      {devsArray[1] || 'backend'}
                    </li>
                    <li>
                      <img src="/img/Counter.png" alt="Counter" />
                      {devsArray[2] || '2022'}
                    </li>
                  </ul>
                  <p className="cards-para">{p.description}</p>
                  <ul className="languages">
                    {tagsArray.map((tag, tIdx) => (
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
            );
          })}
        </div>
      )}

      {/* ── Detail Popup Modal ── */}
      {activeProject && (() => {
        const modalDevs = Array.isArray(activeProject.devs) ? activeProject.devs : [];
        const modalTags = Array.isArray(activeProject.tags) ? activeProject.tags : [];
        return (
          <div className="popup-menus" onClick={() => setActiveProject(null)}>
            <div className="popup-main-container" onClick={e => e.stopPropagation()}>
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
                  <li className="dev1">• {modalDevs[0] || 'Front End'}</li>
                  <li className="dev2">• {modalDevs[1] || 'backend'}</li>
                  <li className="dev2">• {modalDevs[2] || '2022'}</li>
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
                        {modalTags.map((tag, tIdx) => (
                          <li key={tIdx} className="popup-tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                      <div className="popup-button">
                        <a href={activeProject.link} target="_blank" rel="noopener noreferrer">
                          <button type="button" className="popup-button1">
                            {activeProject.liveVersion || 'See Live'}
                            <img src="/img/Icone.png" alt="Live Icon" />
                          </button>
                        </a>
                        <a href={activeProject.srcLink} target="_blank" rel="noopener noreferrer">
                          <button type="button" className="popup-button1">
                            {activeProject.sourceLink || 'See Source'}
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
        );
      })()}
    </div>
  );
}
