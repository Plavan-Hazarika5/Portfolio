// src/hooks/useGsapScroll.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Drives a horizontal scroll track pinned to the viewport.
 * Also interpolates the section background color based on scroll progress.
 *
 * @param {string[]} bgColors - Array of hex/rgb colors to interpolate through
 * Returns { sectionRef, trackRef }
 */
export function useGsapHorizontalScroll(bgColors = ['#040407', '#0d0220', '#020d10']) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const cards = track.querySelectorAll('.tech-card');

    // Calculate how far the track needs to scroll
    const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.abs(getScrollAmount()) + window.innerWidth}`,
          scrub: 1.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Interpolate background color through the array
            const progress = self.progress;
            const colorIndex = progress * (bgColors.length - 1);
            const fromIdx = Math.floor(colorIndex);
            const toIdx = Math.min(fromIdx + 1, bgColors.length - 1);
            const t = colorIndex - fromIdx;

            const from = hexToRgb(bgColors[fromIdx]);
            const to = hexToRgb(bgColors[toIdx]);

            if (from && to) {
              const r = Math.round(from.r + (to.r - from.r) * t);
              const g = Math.round(from.g + (to.g - from.g) * t);
              const b = Math.round(from.b + (to.b - from.b) * t);
              section.style.backgroundColor = `rgb(${r},${g},${b})`;
            }
          },
        },
      });

      tl.to(track, {
        x: getScrollAmount,
        ease: 'none',
      });

      // Stagger cards in slightly on first reveal
      gsap.fromTo(
        cards,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
          },
        }
      );
    });

    return () => mm.revert();
  }, [bgColors]);

  return { sectionRef, trackRef };
}

function hexToRgb(hex) {
  if (!hex || !hex.startsWith('#')) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Fade-in on scroll for any element.
 * Returns a ref to attach to the element.
 */
export function useGsapFadeIn({ y = 40, duration = 0.9, delay = 0 } = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1,
        y: 0,
        duration,
        delay,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [y, duration, delay]);

  return ref;
}