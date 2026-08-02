'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Nav.module.css';
import Logo from './Logo';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const [hash, setHash] = useState('');

  // Scroll threshold detection for scrolled navbar class
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Listen to hash updates and changes
  useEffect(() => {
    setHash(window.location.hash);
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  // Fallback scroll spy listener to highlight about/contact dynamically as user scrolls homepage
  useEffect(() => {
    if (pathname !== '/') return;
    
    const handleScrollSpy = () => {
      const aboutEl = document.getElementById('about');
      const contactEl = document.getElementById('contact');
      if (!aboutEl || !contactEl) return;
      
      const scrollPos = window.scrollY + 160;
      if (scrollPos >= contactEl.offsetTop) {
        setHash('#contact');
      } else if (scrollPos >= aboutEl.offsetTop) {
        setHash('#about');
      } else if (window.scrollY < 200) {
        setHash('');
      }
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [pathname]);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const close = () => setMenuOpen(false);
  const isHome = pathname === '/';
  const needHashRedirect = !isHome;

  const triggerNavSplash = (e: React.MouseEvent) => {
    console.log('triggerNavSplash dispatched coordinates:', e.clientX, e.clientY);
    window.dispatchEvent(
      new CustomEvent('navbar-click', {
        detail: { x: e.clientX, y: e.clientY }
      })
    );
  };

  // State checks for highlighting
  const isHomeActive = pathname === '/' && hash !== '#about' && hash !== '#contact';
  const isProjectsActive = pathname === '/projects';
  const isCertificatesActive = pathname === '/certificates';
  const isAboutActive = pathname === '/' && hash === '#about';
  const isContactActive = pathname === '/' && hash === '#contact';

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Logo />

        {/* Desktop links */}
        <ul className={styles.desktopLinks}>
          <li>
            <Link
              href="/"
              className={`${styles.link} ${isHomeActive ? styles.active : ''}`}
              onClick={triggerNavSplash}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`${styles.link} ${isProjectsActive ? styles.active : ''}`}
              onClick={triggerNavSplash}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/certificates"
              className={`${styles.link} ${isCertificatesActive ? styles.active : ''}`}
              onClick={triggerNavSplash}
            >
              Certificates
            </Link>
          </li>
          <li>
            <Link
              href={needHashRedirect ? '/#about' : '#about'}
              className={`${styles.link} ${isAboutActive ? styles.active : ''}`}
              onClick={(e) => {
                triggerNavSplash(e);
                if (!needHashRedirect) setHash('#about');
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href={needHashRedirect ? '/#contact' : '#contact'}
              className={`${styles.link} ${isContactActive ? styles.active : ''}`}
              onClick={(e) => {
                triggerNavSplash(e);
                if (!needHashRedirect) setHash('#contact');
              }}
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile burger */}
        <button
          className={styles.burger}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <span /><span /><span />
        </button>

        {/* Mobile sidebar */}
        <ul
          ref={menuRef}
          className={`${styles.sidebar} ${menuOpen ? styles.open : ''}`}
        >
          <li>
            <button className={styles.closeBtn} onClick={close} aria-label="Close menu">
              &times;
            </button>
          </li>
          <li>
            <Link
              href="/"
              className={`${styles.sideLink} ${isHomeActive ? styles.active : ''}`}
              onClick={(e) => { close(); triggerNavSplash(e); }}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className={`${styles.sideLink} ${isProjectsActive ? styles.active : ''}`}
              onClick={(e) => { close(); triggerNavSplash(e); }}
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/certificates"
              className={`${styles.sideLink} ${isCertificatesActive ? styles.active : ''}`}
              onClick={(e) => { close(); triggerNavSplash(e); }}
            >
              Certificates
            </Link>
          </li>
          <li>
            <Link
              href={needHashRedirect ? '/#about' : '#about'}
              className={`${styles.sideLink} ${isAboutActive ? styles.active : ''}`}
              onClick={(e) => {
                close();
                triggerNavSplash(e);
                if (!needHashRedirect) setHash('#about');
              }}
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href={needHashRedirect ? '/#contact' : '#contact'}
              className={`${styles.sideLink} ${isContactActive ? styles.active : ''}`}
              onClick={(e) => {
                close();
                triggerNavSplash(e);
                if (!needHashRedirect) setHash('#contact');
              }}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
