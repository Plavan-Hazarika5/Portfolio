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
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktopSmooth = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');

    let lenis = null;
    let gsapTicker = null;
    let removeNativeScroll = null;

    const teardownLenis = () => {
      if (gsapTicker != null) {
        gsap.ticker.remove(gsapTicker);
        gsapTicker = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
        lenisRef.current = null;
      }
    };

    const teardownNative = () => {
      if (removeNativeScroll) {
        removeNativeScroll();
        removeNativeScroll = null;
      }
    };

    const apply = () => {
      teardownLenis();
      teardownNative();

      const useLenisSmooth = desktopSmooth.matches && !prefersReducedMotion.matches;

      if (useLenisSmooth) {
        lenis = new Lenis({
          duration: 1.4,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 2,
          prevent: (node) => Boolean(node?.closest?.('[data-lenis-prevent]')),
        });

        lenisRef.current = lenis;
        lenis.on('scroll', ScrollTrigger.update);

        gsapTicker = gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);
      } else {
        lenisRef.current = null;
        const onScroll = () => ScrollTrigger.update();
        window.addEventListener('scroll', onScroll, { passive: true });
        removeNativeScroll = () => window.removeEventListener('scroll', onScroll);
        ScrollTrigger.update();
      }

      ScrollTrigger.refresh();
    };

    apply();

    const onMq = () => apply();
    desktopSmooth.addEventListener('change', onMq);
    prefersReducedMotion.addEventListener('change', onMq);

    return () => {
      desktopSmooth.removeEventListener('change', onMq);
      prefersReducedMotion.removeEventListener('change', onMq);
      teardownLenis();
      teardownNative();
    };
  }, []);

  return lenisRef;
}