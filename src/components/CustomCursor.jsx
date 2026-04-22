// src/components/CustomCursor.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Custom cursor that:
 * - Follows mouse with a lerp-smoothed dot + ring
 * - Expands + changes label on hover over [data-cursor] elements
 * - Hides the native cursor
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [label, setLabel] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Dot snaps instantly
      gsap.set(dot, { x: mouseX, y: mouseY });
    };

    const onMouseEnter = (e) => {
      const target = e.currentTarget;
      const cursorLabel = target.dataset.cursor || '';
      setLabel(cursorLabel);
      setIsExpanded(true);
    };

    const onMouseLeave = () => {
      setLabel('');
      setIsExpanded(false);
    };

    // Lerp ring to follow mouse
    const tick = () => {
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      gsap.set(ring, { x: ringX, y: ringY });
      rafId = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener('mousemove', onMouseMove);

    // Attach to all interactive elements
    const interactives = document.querySelectorAll(
      'a, button, [data-cursor], input, textarea, select'
    );
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot — snaps instantly */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full bg-white transition-all duration-200 ease-spring ${
            isExpanded ? 'w-2 h-2 opacity-0' : 'w-2 h-2 opacity-100'
          }`}
        />
      </div>

      {/* Ring — lerp follows */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <div
          className={`rounded-full border flex items-center justify-center transition-all duration-300 ease-expo-out ${
            isExpanded
              ? 'w-20 h-20 border-accent-cyan bg-accent-cyan/10 backdrop-blur-sm'
              : 'w-8 h-8 border-white/40 bg-transparent'
          }`}
        >
          {label && (
            <span
              ref={labelRef}
              className="text-accent-cyan font-mono text-[9px] uppercase tracking-widest font-semibold whitespace-nowrap"
            >
              {label}
            </span>
          )}
        </div>
      </div>

      {/* Hide native cursor globally */}
      <style>{`* { cursor: none !important; }`}</style>
    </>
  );
}