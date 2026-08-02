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

interface Certificate {
  id?: number;
  title: string;
  image: string;
  url?: string;
}

interface Contacts {
  twitter: string;
  linkedin: string;
  email: string;
  github: string;
  angel: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Admin Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [languages, setLanguages] = useState<Skill[]>([]);
  const [frameworks, setFrameworks] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [contacts, setContacts] = useState<Contacts>({
    twitter: '',
    linkedin: '',
    email: '',
    github: '',
    angel: ''
  });
  const [resume, setResume] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<'projects' | 'skills' | 'contacts' | 'certificates'>('projects');

  // Certificate Form State
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertUrl, setNewCertUrl] = useState('');
  const [newCertImage, setNewCertImage] = useState('');

  // Form State for Adding/Editing Projects
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [projectForm, setProjectForm] = useState<Project>({
    title: '',
    devs: ['frontend', 'backend', '2022'],
    description: '',
    tags: [],
    image: '',
    liveVersion: 'See Live',
    sourceLink: 'See Source',
    link: '',
    srcLink: ''
  });
  const [projectTagsInput, setProjectTagsInput] = useState('');

  // Skill Form State
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillType, setNewSkillType] = useState<'language' | 'framework'>('language');
  const [newSkillImage, setNewSkillImage] = useState('/img/Ellipse.png');

  // GitHub README generator states
  const [isLoadingReadme, setIsLoadingReadme] = useState(false);

  // Helper: Read file as Base64 string with canvas image compression (max dimension 800px, 0.70 JPEG quality)
  const handleImageUpload = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 800; // Optimal max resolution for portfolio payload optimization

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          callback(compressedBase64);
        } else {
          callback(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Helper: Async canvas compression utility for auto-optimizing existing database images
  const compressBase64Image = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      if (!base64Str || !base64Str.startsWith('data:image') || base64Str.length < 150000) {
        resolve(base64Str);
        return;
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 800;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => resolve(base64Str);
      img.src = base64Str;
    });
  };

  // Helper: Parse markdown content to readable project introduction paragraph
  const cleanReadmeToDescription = (markdown: string): string => {
    let text = markdown;
    
    // Remove markdown comments
    text = text.replace(/<!--[\s\S]*?-->/g, '');
    // Remove image links: ![alt](url)
    text = text.replace(/!\[.*?\]\(.*?\)/g, '');
    // Remove standard links: [text](url) -> text
    text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    // Remove HTML tags
    text = text.replace(/<[^>]*>/g, '');
    // Remove headers: # header
    text = text.replace(/^#+\s+.*$/gm, '');
    // Remove code blocks
    text = text.replace(/```[\s\S]*?```/g, '');
    // Remove bullets and other markdown delimiters
    text = text.replace(/[\*\`\_\-\#\>]/g, '');
    
    // Break into paragraphs, filters, and join first few lines
    const paragraphs = text
      .split('\n')
      .map(p => p.trim())
      .filter(p => p.length > 25);
    
    return paragraphs.slice(0, 3).join('\n\n');
  };

  // Action: Fetch project description from GitHub README
  const handleGenerateDescription = async () => {
    const githubUrl = projectForm.srcLink;
    if (!githubUrl || !githubUrl.includes('github.com')) {
      alert('Please enter a valid GitHub repository URL in the "Source Code URL" field first.');
      return;
    }

    const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/#\?]+)/);
    if (!match) {
      alert('Invalid GitHub URL format. Example: https://github.com/username/repo');
      return;
    }

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, '');

    setIsLoadingReadme(true);
    try {
      // Try main branch first
      let res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`);
      if (!res.ok) {
        // Try master branch
        res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/master/README.md`);
      }

      if (!res.ok) {
        throw new Error('README.md not found in repository root on main or master branches.');
      }

      const markdown = await res.text();
      const desc = cleanReadmeToDescription(markdown);
      if (!desc) {
        throw new Error('Could not extract a readable paragraph description from the README.');
      }

      setProjectForm(prev => ({ ...prev, description: desc }));
      alert('Successfully populated description from GitHub README!');
    } catch (err: any) {
      alert('Failed to generate description: ' + err.message);
    } finally {
      setIsLoadingReadme(false);
    }
  };

  // Fetch data from database API on mount
  const fetchData = async () => {
    try {
      const res = await fetch(`/api/portfolio?t=${Date.now()}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects);
        setLanguages(data.languages);
        setFrameworks(data.frameworks);
        setContacts(data.contacts);
        setResume(data.resume);
        setCertificates(data.certificates || []);
      }
    } catch (err) {
      console.error('Error fetching data from API:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple default password
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Try "admin123"');
    }
  };

  // Background Auto-Optimizer for existing database images (runs when admin is authenticated)
  useEffect(() => {
    if (!isAuthenticated) return;

    const optimizeExistingImages = async () => {
      // 1. Compress Projects
      for (const proj of projects) {
        if (proj.image && proj.image.startsWith('data:image') && proj.image.length > 150000) {
          console.log(`Auto-optimizing huge project image: "${proj.title}"`);
          const compressed = await compressBase64Image(proj.image);
          if (compressed !== proj.image) {
            try {
              const res = await fetch('/api/portfolio/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...proj, image: compressed })
              });
              if (res.ok) {
                console.log(`Auto-optimized project: "${proj.title}"`);
                setProjects(prev => prev.map(p => p.id === proj.id ? { ...p, image: compressed } : p));
              }
            } catch (err) {
              console.error('Failed to auto-optimize project:', err);
            }
          }
        }
      }

      // 2. Compress Certificates
      for (const cert of certificates) {
        if (cert.image && cert.image.startsWith('data:image') && cert.image.length > 150000) {
          console.log(`Auto-optimizing huge certificate image: "${cert.title}"`);
          const compressed = await compressBase64Image(cert.image);
          if (compressed !== cert.image) {
            try {
              const res = await fetch('/api/portfolio/certificates', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...cert, image: compressed })
              });
              if (res.ok) {
                console.log(`Auto-optimized certificate: "${cert.title}"`);
                setCertificates(prev => prev.map(c => c.id === cert.id ? { ...c, image: compressed } : c));
              }
            } catch (err) {
              console.error('Failed to auto-optimize certificate:', err);
            }
          }
        }
      }
    };

    if (projects.length > 0 || certificates.length > 0) {
      optimizeExistingImages();
    }
  }, [isAuthenticated, projects.length, certificates.length]);

  // Project Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedTags = projectTagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const body = {
      ...projectForm,
      tags: updatedTags,
      id: editingProjectId || undefined
    };

    const method = editingProjectId !== null ? 'PUT' : 'POST';

    try {
      const res = await fetch('/api/portfolio/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        resetProjectForm();
        alert('Project saved successfully!');
      } else {
        alert('Failed to save project: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditProject = (index: number) => {
    const p = projects[index];
    setEditingProjectId(p.id || null);
    setProjectForm(p);
    setProjectTagsInput(p.tags.join(', '));
  };

  const handleDeleteProject = async (id?: number) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/portfolio/projects?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Failed to delete project: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      devs: ['frontend', 'backend', '2022'],
      description: '',
      tags: [],
      image: '/img/Snapshoot.png',
      liveVersion: 'See Live',
      sourceLink: 'See Source',
      link: '',
      srcLink: ''
    });
    setProjectTagsInput('');
  };

  // Skill Actions
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const body = {
      name: newSkillName.trim(),
      image: newSkillImage,
      type: newSkillType
    };

    try {
      const res = await fetch('/api/portfolio/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setNewSkillName('');
      } else {
        alert('Failed to add skill: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSkill = async (id?: number) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/portfolio/skills?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Failed to delete skill: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Certificate Actions
  const handleAddCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertImage) {
      alert('Please fill out the title and upload an image.');
      return;
    }

    const body = {
      title: newCertTitle.trim(),
      image: newCertImage,
      url: newCertUrl.trim()
    };

    try {
      const res = await fetch('/api/portfolio/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        setNewCertTitle('');
        setNewCertUrl('');
        setNewCertImage('');
        alert('Certificate added successfully!');
      } else {
        alert('Failed to add certificate: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCertificate = async (id?: number) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const res = await fetch(`/api/portfolio/certificates?id=${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      } else {
        alert('Failed to delete certificate: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Contact / Resume Actions
  const handleSaveContacts = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/portfolio/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, contacts })
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
        alert('Contacts & CV saved successfully!');
      } else {
        alert('Failed to save config: ' + data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={adminStyles.loginContainer}>
        <div style={adminStyles.loginCard}>
          <h1 style={adminStyles.title}>Admin Panel Login</h1>
          <form onSubmit={handleLogin} style={adminStyles.form}>
            <input
              type="password"
              placeholder="Enter admin password (admin123)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={adminStyles.input}
              required
            />
            {error && <p style={adminStyles.error}>{error}</p>}
            <button type="submit" style={adminStyles.loginBtn}>Login</button>
          </form>
          <Link href="/" style={adminStyles.backLink}>← Return to Portfolio</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={adminStyles.adminContainer}>
      <div style={adminStyles.adminCard}>
        <div style={adminStyles.header}>
          <h1 style={adminStyles.dashboardTitle}>Dashboard (DB Managed)</h1>
          <Link href="/" style={adminStyles.viewBtn}>View Site</Link>
        </div>

        {/* Tab Selection */}
        <div style={adminStyles.tabBar}>
          <button
            onClick={() => setActiveTab('projects')}
            style={activeTab === 'projects' ? adminStyles.activeTab : adminStyles.tab}
          >
            Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            style={activeTab === 'skills' ? adminStyles.activeTab : adminStyles.tab}
          >
            Skills ({languages.length + frameworks.length})
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            style={activeTab === 'contacts' ? adminStyles.activeTab : adminStyles.tab}
          >
            Contacts & CV
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            style={activeTab === 'certificates' ? adminStyles.activeTab : adminStyles.tab}
          >
            Certificates ({certificates.length})
          </button>
        </div>

        {/* Tab Content: Projects */}
        {activeTab === 'projects' && (
          <div style={adminStyles.tabContent}>
            <h2 style={adminStyles.subTitle}>
              {editingProjectId !== null ? 'Edit Project' : 'Add New Project'}
            </h2>
            <form onSubmit={handleSaveProject} style={adminStyles.projectForm}>
              <div style={adminStyles.row}>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={projectForm.title}
                  onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
                  style={adminStyles.inputField}
                  required
                />
                <div style={{ flex: '1', minWidth: '240px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Image URL or Base64"
                    value={projectForm.image}
                    onChange={e => setProjectForm({ ...projectForm, image: e.target.value })}
                    style={adminStyles.inputField}
                    required
                  />
                  <label style={adminStyles.fileUploadBtn}>
                    Upload File
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, base64 => {
                            setProjectForm({ ...projectForm, image: base64 });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {projectForm.image && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px' }}>
                  <span style={adminStyles.label}>Image Preview:</span>
                  <img
                    src={projectForm.image}
                    alt="Project preview"
                    style={{ maxHeight: '80px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover' }}
                  />
                </div>
              )}

              <div style={adminStyles.row}>
                <input
                  type="text"
                  placeholder="Live Project URL"
                  value={projectForm.link}
                  onChange={e => setProjectForm({ ...projectForm, link: e.target.value })}
                  style={adminStyles.inputField}
                  required
                />
                <div style={{ flex: '1', minWidth: '240px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Source Code URL"
                    value={projectForm.srcLink}
                    onChange={e => setProjectForm({ ...projectForm, srcLink: e.target.value })}
                    style={adminStyles.inputField}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isLoadingReadme}
                    style={adminStyles.generateBtn}
                  >
                    {isLoadingReadme ? 'Importing...' : 'Fetch README Desc'}
                  </button>
                </div>
              </div>

              <div style={adminStyles.row}>
                <input
                  type="text"
                  placeholder="Category (e.g. Full Stack, Frontend, Backend)"
                  value={projectForm.devs[0] || ''}
                  onChange={e => setProjectForm({ ...projectForm, devs: [e.target.value, projectForm.devs[1] || '', projectForm.devs[2] || ''] })}
                  style={adminStyles.inputField}
                />
                <input
                  type="text"
                  placeholder="Type / Sub-label (e.g. Capstone, Personal)"
                  value={projectForm.devs[1] || ''}
                  onChange={e => setProjectForm({ ...projectForm, devs: [projectForm.devs[0] || '', e.target.value, projectForm.devs[2] || ''] })}
                  style={adminStyles.inputField}
                />
                <input
                  type="text"
                  placeholder="Year (e.g. 2024)"
                  value={projectForm.devs[2] || ''}
                  onChange={e => setProjectForm({ ...projectForm, devs: [projectForm.devs[0] || '', projectForm.devs[1] || '', e.target.value] })}
                  style={{ ...adminStyles.inputField, maxWidth: '120px' }}
                />
              </div>

              <input
                type="text"
                placeholder="Tags (comma-separated, e.g. React, Rails, HTML)"
                value={projectTagsInput}
                onChange={e => setProjectTagsInput(e.target.value)}
                style={adminStyles.fullInputField}
              />

              <textarea
                placeholder="Project Description..."
                value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                style={adminStyles.textArea}
                required
              />

              <div style={adminStyles.btnRow}>
                <button type="submit" style={adminStyles.saveBtn}>
                  {editingProjectId !== null ? 'Update Project' : 'Add Project'}
                </button>
                {editingProjectId !== null && (
                  <button type="button" onClick={resetProjectForm} style={adminStyles.cancelBtn}>
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            <h2 style={{ ...adminStyles.subTitle, marginTop: '40px' }}>Current Projects</h2>
            <div style={adminStyles.projectsList}>
              {projects.map((p, idx) => (
                <div key={idx} style={adminStyles.projectItem}>
                  <div>
                    <h3 style={adminStyles.projectTitle}>{p.title}</h3>
                    <p style={adminStyles.projectDesc}>{p.description.substring(0, 100)}...</p>
                  </div>
                  <div style={adminStyles.actions}>
                    <button onClick={() => handleEditProject(idx)} style={adminStyles.editBtn}>Edit</button>
                    <button onClick={() => handleDeleteProject(p.id)} style={adminStyles.deleteBtn}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content: Skills */}
        {activeTab === 'skills' && (
          <div style={adminStyles.tabContent}>
            <h2 style={adminStyles.subTitle}>Add New Skill Badge</h2>
            <form onSubmit={handleAddSkill} style={adminStyles.skillForm}>
              <input
                type="text"
                placeholder="Skill Name (e.g. Next.js, Python)"
                value={newSkillName}
                onChange={e => setNewSkillName(e.target.value)}
                style={adminStyles.inputField}
                required
              />
              <select
                value={newSkillType}
                onChange={e => setNewSkillType(e.target.value as any)}
                style={adminStyles.select}
              >
                <option value="language">Language</option>
                <option value="framework">Framework</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select
                  value={newSkillImage.startsWith('data:') ? 'custom' : newSkillImage}
                  onChange={e => {
                    if (e.target.value !== 'custom') {
                      setNewSkillImage(e.target.value);
                    }
                  }}
                  style={adminStyles.select}
                >
                  <option value="">None (No Icon)</option>
                  <option value="/img/Ellipse.png">JS Oval (Gold/Purple)</option>
                  <option value="/img/Ellipse(1).png">HTML Oval (Red)</option>
                  <option value="/img/Ellipse(2).png">CSS Oval (Blue)</option>
                  <option value="/img/ruby.png">Ruby Diamond</option>
                  <option value="/img/mysql.png">MySQL Dolphin</option>
                  <option value="/img/bootstrap.png">Bootstrap Purple</option>
                  <option value="/img/react.png">React Blue</option>
                  <option value="/img/rails.png">React/Rails Red</option>
                  <option value="/img/tailwind.png">Tailwind Cyan</option>
                  {newSkillImage.startsWith('data:') && <option value="custom">Custom Upload</option>}
                </select>
                <label style={adminStyles.fileUploadBtn}>
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, base64 => {
                          setNewSkillImage(base64);
                        });
                      }
                    }}
                  />
                </label>
              </div>
              {newSkillImage && (
                <img
                  src={newSkillImage}
                  alt="Skill preview"
                  style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                />
              )}
              <button type="submit" style={adminStyles.saveBtn}>Add Skill</button>
            </form>

            <div style={{ ...adminStyles.row, marginTop: '40px', gap: '30px' }}>
              <div style={{ flex: 1 }}>
                <h3 style={adminStyles.subTitle}>Languages</h3>
                <div style={adminStyles.badgeGrid}>
                  {languages.map((l, idx) => (
                    <div key={idx} style={adminStyles.badgeItem}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {l.image && <img src={l.image} alt={l.name} style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
                        <span>{l.name}</span>
                      </div>
                      <button onClick={() => handleDeleteSkill(l.id)} style={adminStyles.delBadgeBtn}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={adminStyles.subTitle}>Frameworks</h3>
                <div style={adminStyles.badgeGrid}>
                  {frameworks.map((f, idx) => (
                    <div key={idx} style={adminStyles.badgeItem}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        {f.image && <img src={f.image} alt={f.name} style={{ width: '20px', height: '20px', marginRight: '8px' }} />}
                        <span>{f.name}</span>
                      </div>
                      <button onClick={() => handleDeleteSkill(f.id)} style={adminStyles.delBadgeBtn}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Contacts & Resume */}
        {activeTab === 'contacts' && (
          <div style={adminStyles.tabContent}>
            <h2 style={adminStyles.subTitle}>Manage CV Link & Contacts</h2>
            <form onSubmit={handleSaveContacts} style={adminStyles.contactsForm}>
              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>Resume CV Google Drive Link</label>
                <input
                  type="text"
                  value={resume}
                  onChange={e => setResume(e.target.value)}
                  style={adminStyles.fullInputField}
                  required
                />
              </div>

              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>Email Address</label>
                <input
                  type="text"
                  value={contacts.email}
                  onChange={e => setContacts({ ...contacts, email: e.target.value })}
                  style={adminStyles.fullInputField}
                  required
                />
              </div>

              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>GitHub Profile Link</label>
                <input
                  type="text"
                  value={contacts.github}
                  onChange={e => setContacts({ ...contacts, github: e.target.value })}
                  style={adminStyles.fullInputField}
                  required
                />
              </div>

              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>LinkedIn Profile Link</label>
                <input
                  type="text"
                  value={contacts.linkedin}
                  onChange={e => setContacts({ ...contacts, linkedin: e.target.value })}
                  style={adminStyles.fullInputField}
                  required
                />
              </div>

              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>Twitter Profile Link</label>
                <input
                  type="text"
                  value={contacts.twitter}
                  onChange={e => setContacts({ ...contacts, twitter: e.target.value })}
                  style={adminStyles.fullInputField}
                />
              </div>

              <div style={adminStyles.contactRow}>
                <label style={adminStyles.label}>AngelList/Wellfound Link</label>
                <input
                  type="text"
                  value={contacts.angel}
                  onChange={e => setContacts({ ...contacts, angel: e.target.value })}
                  style={adminStyles.fullInputField}
                />
              </div>

              <button type="submit" style={{ ...adminStyles.saveBtn, marginTop: '20px', width: '100%' }}>
                Save Contacts & CV Link
              </button>
            </form>
          </div>
        )}

        {/* Tab Content: Certificates */}
        {activeTab === 'certificates' && (
          <div style={adminStyles.tabContent}>
            <h2 style={adminStyles.subTitle}>Add New Certificate</h2>
            <form onSubmit={handleAddCertificate} style={adminStyles.projectForm}>
              <div style={adminStyles.row}>
                <input
                  type="text"
                  placeholder="Certificate Title (e.g. Full-Stack Dev Degree)"
                  value={newCertTitle}
                  onChange={e => setNewCertTitle(e.target.value)}
                  style={adminStyles.inputField}
                  required
                />
                <input
                  type="text"
                  placeholder="Verification Link (URL, optional)"
                  value={newCertUrl}
                  onChange={e => setNewCertUrl(e.target.value)}
                  style={adminStyles.inputField}
                />
              </div>

              <div style={adminStyles.row}>
                <div style={{ flex: '1', minWidth: '240px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="text"
                    placeholder="Image URL or Base64 (uploaded)"
                    value={newCertImage}
                    onChange={e => setNewCertImage(e.target.value)}
                    style={adminStyles.inputField}
                    required
                  />
                  <label style={adminStyles.fileUploadBtn}>
                    Upload Certificate
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(file, base64 => {
                            setNewCertImage(base64);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {newCertImage && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px' }}>
                  <span style={adminStyles.label}>Certificate Preview:</span>
                  <img
                    src={newCertImage}
                    alt="Certificate preview"
                    style={{ maxHeight: '100px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'contain' }}
                  />
                </div>
              )}

              <button type="submit" style={{ ...adminStyles.saveBtn, alignSelf: 'flex-start' }}>
                Add Certificate
              </button>
            </form>

            <h2 style={{ ...adminStyles.subTitle, marginTop: '40px' }}>Current Certificates</h2>
            <div style={adminStyles.projectsList}>
              {certificates.map((c, idx) => (
                <div key={idx} style={adminStyles.projectItem}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {c.image && (
                      <img src={c.image} alt={c.title} style={{ width: '60px', height: '40px', objectFit: 'contain', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                    )}
                    <div>
                      <h3 style={adminStyles.projectTitle}>{c.title}</h3>
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#818cf8', textDecoration: 'none' }}>
                          Verify Credential &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCertificate(c.id)} style={adminStyles.deleteBtn}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const adminStyles: Record<string, React.CSSProperties> = {
  loginContainer: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginCard: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(20, 20, 43, 0.75)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '40px 30px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px'
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#f0f0ff',
    textAlign: 'center',
    letterSpacing: '-0.5px'
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '14px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
    textAlign: 'center'
  },
  error: {
    color: '#ef4444',
    fontSize: '13px',
    textAlign: 'center'
  },
  loginBtn: {
    width: '100%',
    height: '44px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)'
  },
  backLink: {
    color: 'rgba(220, 220, 255, 0.5)',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.2s'
  },
  adminContainer: {
    minHeight: '100vh',
    padding: '100px 6% 60px',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  adminCard: {
    background: 'rgba(20, 20, 43, 0.65)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '40px',
    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '20px',
    marginBottom: '30px'
  },
  dashboardTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#f0f0ff',
    letterSpacing: '-0.5px'
  },
  viewBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(99, 102, 241, 0.4)',
    color: '#818cf8',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '13px',
    background: 'rgba(99, 102, 241, 0.05)',
    transition: 'all 0.2s'
  },
  tabBar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '30px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    paddingBottom: '10px'
  },
  tab: {
    padding: '10px 20px',
    background: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid transparent',
    color: 'rgba(220, 220, 255, 0.5)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'color 0.2s, border-color 0.2s'
  },
  activeTab: {
    padding: '10px 20px',
    background: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    borderBottom: '2px solid #6366f1',
    color: '#818cf8',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  subTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f0f0ff',
    letterSpacing: '-0.3px',
    marginBottom: '8px'
  },
  projectForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  inputField: {
    flex: '1',
    minWidth: '240px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none'
  },
  fullInputField: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none'
  },
  textArea: {
    width: '100%',
    height: '120px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f0f0ff',
    fontSize: '14px',
    outline: 'none',
    resize: 'vertical'
  },
  btnRow: {
    display: 'flex',
    gap: '12px'
  },
  saveBtn: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px'
  },
  cancelBtn: {
    padding: '12px 24px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#f0f0ff',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px'
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  projectItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)',
    padding: '20px',
    borderRadius: '12px',
    gap: '20px'
  },
  projectTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f0f0ff',
    marginBottom: '4px'
  },
  projectDesc: {
    fontSize: '13px',
    color: 'rgba(220,220,255,0.6)'
  },
  actions: {
    display: 'flex',
    gap: '8px'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    color: '#818cf8',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#ef4444',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  skillForm: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  select: {
    backgroundColor: '#14142b',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '8px',
    padding: '12px',
    color: '#f0f0ff',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  badgeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '12px'
  },
  badgeItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  delBadgeBtn: {
    background: 'none',
    border: 'none',
    color: '#ef4444',
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: '1'
  },
  contactsForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  contactRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
   label: {
    fontSize: '13px',
    color: 'rgba(220, 220, 255, 0.6)',
    fontWeight: '500'
  },
  fileUploadBtn: {
    padding: '12px 18px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#f0f0ff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s'
  },
  generateBtn: {
    padding: '12px 18px',
    background: 'rgba(99, 102, 241, 0.1)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    color: '#818cf8',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s'
  }
};
