'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './Nav.module.css';
import Logo from './Logo';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.nav}>
        <Logo />

        {/* Desktop links */}
        <ul className={styles.desktopLinks}>
          {['portfolio', 'about', 'contact'].map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={styles.link}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
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
          {['portfolio', 'about', 'contact'].map((id) => (
            <li key={id}>
              <a href={`#${id}`} className={styles.sideLink} onClick={close}>
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
