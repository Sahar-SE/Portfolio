'use client';

import { useState, useEffect } from 'react';

interface Certificate {
  id: number;
  title: string;
  image: string;
  url?: string;
  category?: 'certificate' | 'badge';
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch certificates from DB
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`/api/portfolio/certificates?t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.certificates) {
          setCertificates(data.certificates);
        }
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (activeCertificate) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeCertificate]);

  const certList   = certificates.filter(c => (c.category ?? 'certificate') === 'certificate');
  const badgeList  = certificates.filter(c => c.category === 'badge');

  const renderCard = (c: Certificate, idx: number) => (
    <article key={c.id || idx} className="cert-catalog-card" onClick={() => setActiveCertificate(c)}>
      <div className="cert-card-image">
        <img src={c.image} alt={c.title} />
        <div className="cert-card-overlay">
          <span className="view-details-tag">Expand View</span>
        </div>
      </div>
      <div className="cert-card-body">
        <h2 className="cert-card-title">{c.title}</h2>
        {c.url && (
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="cert-verify-link"
          >
            Verify Authority &rarr;
          </a>
        )}
      </div>
    </article>
  );

  return (
    <div className="certificates-page-container">

      {/* ── Header ── */}
      <section className="projects-header">
        <h1 className="projects-title">Verified <span className="gradient-text">Credentials</span></h1>
        <p className="projects-subtitle">
          Professional program degrees, achievements, and technical course completions verified from institutions.
        </p>
      </section>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="loading-core" />
          </div>
          <p className="loading-text">Retrieving secure credentials...</p>
        </div>
      ) : certificates.length === 0 ? (
        <div className="empty-results">
          <p>No certificates or badges are currently published.</p>
        </div>
      ) : (
        <>
          {/* ── Certificates Section ── */}
          {certList.length > 0 && (
            <section className="cred-section">
              <div className="cred-section-header">
                <div className="cred-section-icon">🎓</div>
                <div>
                  <h2 className="cred-section-title">Certificates</h2>
                  <p className="cred-section-subtitle">Verified program completions & degrees</p>
                </div>
                <span className="cred-count-pill">{certList.length}</span>
              </div>
              <div className="certificates-catalog-grid">
                {certList.map((c, idx) => renderCard(c, idx))}
              </div>
            </section>
          )}

          {/* ── Badges Section ── */}
          {badgeList.length > 0 && (
            <section className="cred-section">
              <div className="cred-section-header">
                <div className="cred-section-icon">🏅</div>
                <div>
                  <h2 className="cred-section-title">Badges</h2>
                  <p className="cred-section-subtitle">Skills, achievements & micro-credentials</p>
                </div>
                <span className="cred-count-pill cred-count-pill--violet">{badgeList.length}</span>
              </div>
              <div className="badges-catalog-grid">
                {badgeList.map((c, idx) => renderCard(c, idx))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ── Lightbox Detail Modal ── */}
      {activeCertificate && (
        <div className="lightbox-overlay" onClick={() => setActiveCertificate(null)}>
          <div className="lightbox-container" onClick={e => e.stopPropagation()}>
            <div className="lightbox-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>
                  {activeCertificate.category === 'badge' ? '🏅' : '🎓'}
                </span>
                <h2 className="lightbox-title">{activeCertificate.title}</h2>
              </div>
              <button className="lightbox-close" onClick={() => setActiveCertificate(null)}>&times;</button>
            </div>
            <div className="lightbox-image-wrap">
              <img src={activeCertificate.image} alt={activeCertificate.title} />
            </div>
            {activeCertificate.url && (
              <div className="lightbox-footer">
                <a
                  href={activeCertificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Verify {activeCertificate.category === 'badge' ? 'Badge' : 'Certificate'} Link
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
