'use client';

import { useState, useEffect, useRef } from 'react';

export default function ThreeDCharacter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left - width / 2;
      const mouseY = e.clientY - rect.top - height / 2;

      // Calculate rotation angles (clamped to max 25 degrees)
      const rotateY = (mouseX / (width / 2)) * 22;
      const rotateX = -(mouseY / (height / 2)) * 22;

      // Parallax offset for the glow shadow (max 15px)
      const shadowX = (mouseX / (width / 2)) * 15;
      const shadowY = (mouseY / (height / 2)) * 15;

      setCoords({ rotateX, rotateY, shadowX, shadowY });
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsMouseDown(false);
      setCoords({ rotateX: 0, rotateY: 0, shadowX: 0, shadowY: 0 });
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  const scale = isMouseDown ? 0.95 : isHovered ? 1.05 : 1.0;

  return (
    <div style={style.perspectiveContainer}>
      {/* Moving Glow Backdrop */}
      <div
        style={{
          ...style.glowBackdrop,
          transform: `translate(calc(-50% + ${coords.shadowX}px), calc(-50% + ${coords.shadowY}px))`,
          opacity: isHovered ? 0.7 : 0.45,
        }}
      />

      {/* Main 3D Card */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsMouseDown(true)}
        onMouseUp={() => setIsMouseDown(false)}
        style={{
          ...style.card,
          transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${coords.rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`,
          boxShadow: isHovered
            ? `0 20px 45px rgba(0, 0, 0, 0.6), ${-coords.shadowX}px ${-coords.shadowY}px 30px rgba(99, 102, 241, 0.25)`
            : '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 0 rgba(0,0,0,0)',
        }}
      >
        {/* Character Image container */}
        <div style={style.imageContainer}>
          <img
            src="/img/character.jpg"
            alt="Sahar Saba Amiri"
            style={style.image}
          />
        </div>

        {/* Reflection Shine overlay */}
        <div
          style={{
            ...style.shineOverlay,
            background: `linear-gradient(${135 + coords.rotateY * 2}deg, rgba(255,255,255,${
              isHovered ? 0.12 : 0.03
            }) 0%, rgba(255,255,255,0) 60%)`,
          }}
        />

        {/* Outer glowing glass frame border */}
        <div style={style.glassFrame} />
      </div>
    </div>
  );
}

const style: Record<string, React.CSSProperties> = {
  perspectiveContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: '360px',
    height: '480px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  glowBackdrop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45) 0%, rgba(99, 102, 241, 0.2) 50%, transparent 70%)',
    zIndex: 0,
    pointerEvents: 'none',
    transition: 'transform 0.1s ease-out, opacity 0.3s ease',
    filter: 'blur(30px)',
  },
  card: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(20, 20, 43, 0.45)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    overflow: 'hidden',
    cursor: 'pointer',
    zIndex: 1,
    transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out',
    transformStyle: 'preserve-3d',
    pointerEvents: 'auto', // Force pointer actions to capture mouse natively!
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    transform: 'translateZ(30px) scale(0.95)', // Push image forward in 3D perspective space!
    transition: 'transform 0.2s ease',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    objectPosition: 'top', // Ensures the face at the top of the portrait is fully visible
    borderRadius: '16px',
    filter: 'brightness(0.92) contrast(1.05)',
  },
  shineOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 2,
    pointerEvents: 'none',
    transition: 'background 0.1s ease-out',
  },
  glassFrame: {
    position: 'absolute',
    inset: 0,
    border: '1px solid rgba(255, 255, 255, 0.15)',
    borderRadius: '24px',
    pointerEvents: 'none',
    zIndex: 3,
  },
};
