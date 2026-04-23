// src/hooks/useLenis.js
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Initializes Lenis smooth scroll and syncs it with GSAP ScrollTrigger.
 * Returns the lenis instance for external control (e.g., scrollTo).
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // Don't let Lenis hijack scroll interactions on specific elements
      // (e.g. the Tech Stack horizontal scroller).
      prevent: (node) => Boolean(node?.closest?.('[data-lenis-prevent]')),
    });

    lenisRef.current = lenis;

    // Bridge Lenis scroll events into GSAP's ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const gsapTicker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
    };
  }, []);

  return lenisRef;
}