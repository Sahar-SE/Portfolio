'use client';

import { useEffect, useRef } from 'react';

export default function AuroraCanvas() {
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

      // Initialize the WebGL Fluid Simulation
      WebGLFluid(canvas, {
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
          get r() { return currentColor.r; },
          get g() { return currentColor.g; },
          get b() { return currentColor.b; },
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
      });

      // Track current mouse position globally for scroll trails
      let currentMouseX = window.innerWidth / 2;
      let currentMouseY = window.innerHeight / 2;

      // ─── Custom Mouse Event Class ───
      // Extends native MouseEvent to cleanly override read-only offsetX/offsetY
      // properties without using Object.defineProperty on the instance.
      class CustomMouseEvent extends MouseEvent {
        private _offsetX: number;
        private _offsetY: number;

        constructor(type: string, dict: MouseEventInit & { offsetX: number; offsetY: number }) {
          super(type, dict);
          this._offsetX = dict.offsetX;
          this._offsetY = dict.offsetY;
        }

        get offsetX() { return this._offsetX; }
        get offsetY() { return this._offsetY; }
      }

      // Helper to construct our CustomMouseEvent
      const createCustomMouseEvent = (type: string, clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        return new CustomMouseEvent(type, {
          bubbles: true,
          cancelable: true,
          clientX: clientX,
          clientY: clientY,
          screenX: clientX,
          screenY: clientY,
          button: 0,
          buttons: 1,
          offsetX: offsetX,
          offsetY: offsetY,
        });
      };

      // Handle window mouse move to track coordinate and dispatch to canvas
      const onWindowMouseMove = (e: MouseEvent) => {
        currentMouseX = e.clientX;
        currentMouseY = e.clientY;
        selectRandomColor(); // Rotate colors on movement

        const customEvent = createCustomMouseEvent('mousemove', e.clientX, e.clientY);
        canvas.dispatchEvent(customEvent);
      };

      // Handle window click — fire a synchronous radial burst of mousemove events.
      // TRIGGER:'hover' means the library creates splats from mousemove distance,
      // so no mousedown state is required at all.
      const onWindowClick = (e: MouseEvent) => {
        const cx = e.clientX;
        const cy = e.clientY;
        const spokes = 14;       // radial directions
        const steps = 5;         // moves per spoke (near → far)
        const burstRadius = 38;  // max px outward

        for (let d = 0; d < spokes; d++) {
          selectRandomColor();
          const theta = (d / spokes) * 2 * Math.PI;
          // Move outward along each spoke
          for (let s = 1; s <= steps; s++) {
            const dist = (burstRadius * s) / steps;
            const mx = cx + Math.cos(theta) * dist;
            const my = cy + Math.sin(theta) * dist;
            canvas.dispatchEvent(createCustomMouseEvent('mousemove', mx, my));
          }
          // Return to centre so next spoke starts fresh
          canvas.dispatchEvent(createCustomMouseEvent('mousemove', cx, cy));
        }
      };

      // Handle window scroll to generate ink trails at current mouse position
      let scrollOffset = 1;
      const onWindowScroll = () => {
        selectRandomColor(); // Rotate colors on scroll

        // Toggle offset back and forth to create a non-zero coordinate delta,
        // which forces WebGL Fluid to draw the trail at the current mouse position.
        scrollOffset = -scrollOffset;
        const scrollEvent = createCustomMouseEvent('mousemove', currentMouseX + scrollOffset, currentMouseY + scrollOffset);
        canvas.dispatchEvent(scrollEvent);
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

      // Listeners
      window.addEventListener('click', onWindowClick, { passive: true });
      window.addEventListener('mousemove', onWindowMouseMove, { passive: true });
      window.addEventListener('scroll', onWindowScroll, { passive: true });
      window.addEventListener('touchstart', forwardTouchEvent, { passive: true });
      window.addEventListener('touchmove', forwardTouchEvent, { passive: true });

      cleanupListeners = () => {
        window.removeEventListener('click', onWindowClick);
        window.removeEventListener('mousemove', onWindowMouseMove);
        window.removeEventListener('scroll', onWindowScroll);
        window.removeEventListener('touchstart', forwardTouchEvent);
        window.removeEventListener('touchmove', forwardTouchEvent);
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
        zIndex: 0,
        pointerEvents: 'none', // Allows native browser scroll/swipe touch events to pass through on mobile
      }}
    />
  );
}
