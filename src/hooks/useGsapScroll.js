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
      // IMPORTANT UX CHOICE:
      // We intentionally avoid pinning this section on desktop because it can
      // feel like the page is "stuck" at Tech Stack. Desktop users can still
      // explore the cards via horizontal scroll on the track itself.

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