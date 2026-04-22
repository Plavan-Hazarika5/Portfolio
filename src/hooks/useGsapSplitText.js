// src/hooks/useGsapSplitText.js
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * Splits text into individual char/word spans and animates them
 * emerging from a clip-path mask on mount.
 *
 * Usage:
 *   const ref = useGsapSplitText({ type: 'chars', delay: 0.2 });
 *   <h1 ref={ref}>Hello World</h1>
 */
export function useGsapSplitText({ type = 'chars', delay = 0, stagger = 0.04 } = {}) {
  const elRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const originalText = el.textContent;
    const words = originalText.split(' ');

    // Build inner spans — each word wrapped, each char wrapped inside
    el.innerHTML = words
      .map((word) => {
        const chars =
          type === 'chars'
            ? word
                .split('')
                .map(
                  (char) =>
                    `<span class="char-inner" style="display:inline-block;will-change:transform">${char}</span>`
                )
                .join('')
            : `<span class="char-inner" style="display:inline-block;will-change:transform">${word}</span>`;

        return `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:0.1em">${chars}</span>`;
      })
      .join(type === 'chars' ? '<span style="display:inline-block;width:0.3em"> </span>' : ' ');

    const innerEls = el.querySelectorAll('.char-inner');

    // Set initial state — translate up inside overflow:hidden mask
    gsap.set(innerEls, { yPercent: 110, opacity: 0, skewY: 4 });

    const tl = gsap.timeline({ delay });

    tl.to(innerEls, {
      yPercent: 0,
      opacity: 1,
      skewY: 0,
      duration: 1,
      stagger,
      ease: 'expo.out',
    });

    return () => {
      tl.kill();
      el.textContent = originalText;
    };
  }, [type, delay, stagger]);

  return elRef;
}