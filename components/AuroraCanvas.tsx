'use client';

import { useEffect, useRef, useState } from 'react';

// Inner component that handles the WebGL fluid context and loop
function FluidCanvas({ isVisible }: { isVisible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupListeners: (() => void) | null = null;

    // Website colors: Indigo, Violet, Cyan
    const colors = [
      { r: 0.39, g: 0.40, b: 0.95 }, // Indigo (#6366f1)
      { r: 0.55, g: 0.36, b: 0.96 }, // Violet (#8b5cf6)
      { r: 0.13, g: 0.83, b: 0.93 }  // Cyan (#22d3ee)
    ];

    let currentColor = colors[0];

    const selectRandomColor = () => {
      currentColor = colors[Math.floor(Math.random() * colors.length)];
    };

    // Dynamically import webgl-fluid to prevent SSR compilation errors in Next.js
    import('webgl-fluid').then((module) => {
      const WebGLFluid = module.default;

      let colorScale = 1.0;

      const fluidConfig = {
        TRIGGER: 'hover',
        IMMEDIATE: true,
        AUTO: false,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 0.12,     // Fades out in exactly ~20 seconds
        VELOCITY_DISSIPATION: 0.90,    // Swirls spin and drift longer
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 45,                      // High curl/vorticity for elegant ink swirls
        SPLAT_RADIUS: 0.65,            // Wider area splat (covers wide area)
        SPLAT_FORCE: 8000,             // Splat velocity/force
        SPLAT_COUNT: 4,
        SHADING: true,
        COLORFUL: false,               // Disable random colorful spectrum to use website colors
        SPLAT_COLOR: {
          get r() { return currentColor.r * colorScale; },
          get g() { return currentColor.g * colorScale; },
          get b() { return currentColor.b * colorScale; },
        },
        BACK_COLOR: { r: 9, g: 9, b: 15 }, // #09090f background color
        TRANSPARENT: false,
        BLOOM: true,                   // High glow
        BLOOM_ITERATIONS: 8,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.9,
        BLOOM_THRESHOLD: 0.3,
        BLOOM_SOFT_KNEE: 0.7,
        SUNRAYS: true,
        SUNRAYS_RESOLUTION: 196,
        SUNRAYS_WEIGHT: 0.8,
      };

      // Initialize the WebGL Fluid Simulation with the mutable config object
      WebGLFluid(canvas, fluidConfig);

      // Track current mouse position globally for scroll trails
      let currentMouseX = window.innerWidth / 2;
      let currentMouseY = window.innerHeight / 2;

      // Helper to construct our CustomMouseEvent using standard Object.defineProperties
      const createCustomMouseEvent = (type: string, clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        const event = new MouseEvent(type, {
          bubbles: false, // Set to false to prevent infinite event bubbling loop
          cancelable: true,
          clientX: clientX,
          clientY: clientY,
          screenX: clientX,
          screenY: clientY,
          button: 0,
          buttons: 1,
        });

        Object.defineProperties(event, {
          offsetX: { value: offsetX, writable: true, configurable: true },
          offsetY: { value: offsetY, writable: true, configurable: true },
        });

        return event;
      };

      // Handle window mouse move to track coordinate and dispatch to canvas
      const onWindowMouseMove = (e: MouseEvent) => {
        if (!e.isTrusted) return; // Prevent loop from custom events
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
        selectRandomColor(); // Rotate colors on movement

        const customEvent = createCustomMouseEvent('mousemove', e.clientX, e.clientY);
        canvas.dispatchEvent(customEvent);
      };

      // Helper to trigger a small simulated mousemove splat (necessary because TRIGGER is 'hover')
      const triggerSplatAt = (cx: number, cy: number) => {
        const spokes = 8;
        const steps = 3;
        const radius = 10;
        for (let d = 0; d < spokes; d++) {
          const theta = (d / spokes) * 2 * Math.PI;
          for (let s = 1; s <= steps; s++) {
            const dist = (radius * s) / steps;
            const mx = cx + Math.cos(theta) * dist;
            const my = cy + Math.sin(theta) * dist;
            canvas.dispatchEvent(createCustomMouseEvent('mousemove', mx, my));
          }
        }
        canvas.dispatchEvent(createCustomMouseEvent('mousemove', cx, cy));
      };

      // Handle window click — fire native mousedown/mouseup splats directly
      const onWindowClick = (e: MouseEvent) => {
        if (!e.isTrusted) return; // Prevent loop from custom events
        const target = e.target as HTMLElement;
        if (!target) return;

        const cx = e.clientX;
        const cy = e.clientY;

        // Auto-detect if click happened on an interactive element/item (links, buttons, inputs, form controls, clickable cards/badges)
        const clickedItem = target.closest('a, button, input, textarea, .btn, .show-more-btn, .tag-more-badge, [role="button"]');

        if (clickedItem) {
          const isHeaderClick = target && typeof target.closest === 'function' && target.closest('header');
          const spawnY = isHeaderClick ? Math.max(cy, 85) : cy;

          // Force theme color to Indigo (#6366f1) which is colors[0]
          currentColor = colors[0];

          // Make the splat small and subtle for item clicks
          fluidConfig.SPLAT_RADIUS = 0.22;  // Standard is 0.65
          fluidConfig.SPLAT_FORCE = 2500;   // Standard is 8000
          colorScale = 0.90;

          triggerSplatAt(cx, spawnY);

          // Restore original settings
          fluidConfig.SPLAT_RADIUS = 0.65;
          fluidConfig.SPLAT_FORCE = 8000;
          colorScale = 1.0;
        }
      };

      const forwardTouchEvent = (e: TouchEvent) => {
        if (e.targetTouches.length === 0) return;
        const touch = e.targetTouches[0];
        currentMouseX = touch.clientX;
        currentMouseY = touch.clientY;
        selectRandomColor();

        const customEvent = new TouchEvent(e.type, {
          bubbles: true,
          cancelable: true,
          targetTouches: Array.from(e.targetTouches) as any,
          changedTouches: Array.from(e.changedTouches) as any,
          touches: Array.from(e.touches) as any,
        });
        canvas.dispatchEvent(customEvent);
      };

      const onNavbarClick = (e: Event) => {
        const customEvent = e as CustomEvent<{ x: number; y: number }>;
        const { x, y } = customEvent.detail;

        // Spawn below the blurred header
        const spawnY = Math.max(y, 85);

        // Force theme color to Indigo (#6366f1) which is colors[0]
        currentColor = colors[0];

        // Make the splat small and subtle
        fluidConfig.SPLAT_RADIUS = 0.22;
        fluidConfig.SPLAT_FORCE = 2500;
        colorScale = 0.90;

        triggerSplatAt(x, spawnY);

        // Restore original settings
        fluidConfig.SPLAT_RADIUS = 0.65;
        fluidConfig.SPLAT_FORCE = 8000;
        colorScale = 1.0;
      };

      // Ambient background drifting loop (keeps fluid flows always looping in the background)
      const triggerDriftSplat = () => {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;

        const spokes = 8;
        const steps = 4;
        const burstRadius = 32;

        selectRandomColor();
        for (let d = 0; d < spokes; d++) {
          const theta = (d / spokes) * 2 * Math.PI;
          for (let s = 1; s <= steps; s++) {
            const dist = (burstRadius * s) / steps;
            const mx = x + Math.cos(theta) * dist;
            const my = y + Math.sin(theta) * dist;
            canvas.dispatchEvent(createCustomMouseEvent('mousemove', mx, my));
          }
        }
        canvas.dispatchEvent(createCustomMouseEvent('mousemove', x, y));
      };

      // Trigger first splat immediately on mount
      triggerDriftSplat();

      // Keep it looping continuously every 70 seconds
      const autoInterval = setInterval(triggerDriftSplat, 70000);

      // Listeners
      window.addEventListener('click', onWindowClick, { passive: true });
      window.addEventListener('navbar-click', onNavbarClick, { passive: true });
      window.addEventListener('touchstart', forwardTouchEvent, { passive: true });

      cleanupListeners = () => {
        clearInterval(autoInterval);
        window.removeEventListener('click', onWindowClick);
        window.removeEventListener('navbar-click', onNavbarClick);
        window.removeEventListener('touchstart', forwardTouchEvent);
      };
    }).catch((err) => {
      console.error('Failed to load webgl-fluid:', err);
    });

    return () => {
      if (cleanupListeners) {
        cleanupListeners();
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 3s ease-out',
      }}
    />
  );
}

// Wrapper component that remains mounted to catch window interaction events and wake up the canvas
export default function AuroraCanvas() {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);

  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const destroyTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimer = () => {
    setIsVisible(true);
    setShouldRender(true);

    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    if (destroyTimerRef.current) clearTimeout(destroyTimerRef.current);

    fadeTimerRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 70000); // Fade out after 70 seconds of idle time

    destroyTimerRef.current = setTimeout(() => {
      setShouldRender(false);
    }, 73000); // Unmount after fade completes
  };

  useEffect(() => {
    resetInactivityTimer();

    const events = ['mousemove', 'click', 'scroll', 'touchstart', 'navbar-click'];
    const handleActivity = () => {
      resetInactivityTimer();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
      if (destroyTimerRef.current) clearTimeout(destroyTimerRef.current);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  if (!shouldRender) return null;

  return <FluidCanvas isVisible={isVisible} />;
}
