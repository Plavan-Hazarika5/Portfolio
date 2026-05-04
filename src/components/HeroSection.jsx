// src/components/HeroSection.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useGsapSplitText } from '../hooks/useGsapSplitText';

export default function HeroSection() {
  const titleRef = useGsapSplitText({ type: 'chars', delay: 0.3, stagger: 0.03 });
  const subtitleRef = useGsapSplitText({ type: 'words', delay: 0.9, stagger: 0.07 });
  const metaRef = useRef(null);
  const scrollCueRef = useRef(null);
  const orbRef1 = useRef(null);
  const orbRef2 = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Fade in meta line and scroll cue
    gsap.fromTo(
      [metaRef.current, scrollCueRef.current],
      { opacity: 0, y: reduced ? 0 : 20 },
      {
        opacity: 1,
        y: 0,
        duration: reduced ? 0.35 : 1,
        stagger: reduced ? 0 : 0.2,
        delay: reduced ? 0.2 : 1.6,
        ease: 'expo.out',
      }
    );

    if (reduced) return;

    // Ambient orb float (skip when user prefers reduced motion)
    gsap.to(orbRef1.current, {
      y: -30,
      x: 20,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to(orbRef2.current, {
      y: 25,
      x: -15,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: 2,
    });
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden bg-void pt-[max(5.5rem,env(safe-area-inset-top,0px)+4.5rem)] pb-10 md:pt-0 md:pb-0"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      {/* Ambient glowing orbs */}
      <div
        ref={orbRef1}
        className="absolute top-1/4 left-1/4 w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full pointer-events-none motion-reduce:opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />
      <div
        ref={orbRef2}
        className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full pointer-events-none motion-reduce:opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
          filter: 'blur(32px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
        {/* Eyebrow badge */}
        <div
          ref={metaRef}
          className="mb-6 sm:mb-8 inline-flex max-w-[min(100%,22rem)] sm:max-w-none flex-wrap items-center justify-center gap-2 px-3 py-2 sm:px-4 rounded-full border border-glass-border bg-glass backdrop-blur-[10px] md:backdrop-blur-glass"
        >
          <span className="w-2 h-2 shrink-0 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-[10px] sm:text-xs text-white/60 tracking-widest uppercase text-center leading-snug">
            Open to Remote Projects — 2026
          </span>
        </div>

        {/* Main title — GSAP split text target */}
        <h1
          ref={titleRef}
          className="font-display text-[clamp(2rem,8vw+0.85rem,13rem)] leading-[0.92] tracking-tight text-white mb-4 sm:mb-6 select-none px-1 break-words [overflow-wrap:anywhere]"
        >
          PLAVAN HAZARIKA
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-[clamp(0.95rem,3.8vw,1.4rem)] text-white/50 max-w-2xl leading-relaxed mt-4 sm:mt-6"
        >
          I am a UI/UX-focused developer who designs polished, user-centered experiences with Figma and strong product thinking. I also build full-stack web applications with React and Node.js to turn ideas into scalable, production-ready products.
        </p>

        {/* CTA row */}
        <div className="mt-8 sm:mt-12 flex w-full max-w-md sm:max-w-none flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center px-1">
          <a
            href="#projects"
            data-cursor="VIEW"
            className="group relative inline-flex min-h-[48px] w-full sm:w-auto touch-manipulation items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 bg-accent-cyan text-void font-mono text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 hover:shadow-glow-cyan active:scale-[0.98]"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-expo-out" />
          </a>
          <a
            href="#contact"
            data-cursor="TALK"
            className="inline-flex min-h-[48px] w-full sm:w-auto touch-manipulation items-center justify-center px-6 py-3.5 sm:px-8 sm:py-4 border border-glass-border bg-glass backdrop-blur-[10px] md:backdrop-blur-glass text-white font-mono text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:border-white/30 hover:bg-white/10 active:scale-[0.98]"
          >
            Let's Talk
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-[max(1.25rem,env(safe-area-inset-bottom,0px)+0.5rem)] md:bottom-10 left-1/2 -translate-x-1/2 hidden min-[420px]:flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>
    </section>
  );
}