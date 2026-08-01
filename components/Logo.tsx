'use client';

import styles from './Logo.module.css';

export default function Logo() {
  return (
    <span className={styles.logoWrap} aria-label="Sahar – home">
      {/* ── Mark: geometric hexagon + letter S ── */}
      <svg
        className={styles.mark}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Main gradient: indigo → violet → cyan */}
          <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#818cf8" />
            <stop offset="50%"  stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="logoGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Clip path for the hexagon shape */}
          <clipPath id="hexClip">
            <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" />
          </clipPath>
        </defs>

        {/* Hexagon border */}
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          stroke="url(#logoGrad)"
          strokeWidth="1.5"
          fill="rgba(99,102,241,0.08)"
          filter="url(#logoGlow)"
          className={styles.hexBorder}
        />

        {/* Inner glow fill on hover (handled via CSS opacity) */}
        <polygon
          points="20,4 34,12 34,28 20,36 6,28 6,12"
          fill="url(#logoGrad)"
          opacity="0"
          className={styles.hexFill}
        />

        {/* Letter S path – clean geometric */}
        <text
          x="20"
          y="27"
          textAnchor="middle"
          fontFamily="'Inter', sans-serif"
          fontWeight="800"
          fontSize="20"
          fill="url(#logoGrad)"
          filter="url(#logoGlow)"
          className={styles.letter}
        >
          S
        </text>
      </svg>

      {/* ── Wordmark ── */}
      <span className={styles.wordmark}>
        <span className={styles.first}>Sah</span>
        <span className={styles.accent}>ar</span>
      </span>
    </span>
  );
}
