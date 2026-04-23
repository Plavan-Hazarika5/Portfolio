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
    // Fade in meta line and scroll cue
    gsap.fromTo(
      [metaRef.current, scrollCueRef.current],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        delay: 1.6,
        ease: 'expo.out',
      }
    );

    // Ambient orb float
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
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-void"
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      {/* Ambient glowing orbs */}
      <div
        ref={orbRef1}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        ref={orbRef2}
        className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,229,255,0.12) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto">
        {/* Eyebrow badge */}
        <div
          ref={metaRef}
          className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-glass-border bg-glass backdrop-blur-glass"
        >
          <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
           Open to Remote Projects — 2026
          </span>
        </div>

        {/* Main title — GSAP split text target */}
        <h1
          ref={titleRef}
          className="font-display text-[clamp(4rem,14vw,13rem)] leading-none tracking-tight text-white mb-6 select-none"
          style={{ lineHeight: '0.9' }}
        >
          PLAVAN HAZARIKA
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-body text-[clamp(1rem,2.5vw,1.4rem)] text-white/50 max-w-2xl leading-relaxed mt-6"
        >
          I am a UI/UX-focused developer who designs polished, user-centered experiences with Figma and strong product thinking. I also build full-stack web applications with React and Node.js to turn ideas into scalable, production-ready products.
        </p>

        {/* CTA row */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <a
            href="#projects"
            data-cursor="VIEW"
            className="group relative px-8 py-4 bg-accent-cyan text-void font-mono text-sm font-bold uppercase tracking-widest rounded-full overflow-hidden transition-all duration-300 hover:shadow-glow-cyan"
          >
            <span className="relative z-10">View Projects</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-expo-out" />
          </a>
          <a
            href="#contact"
            data-cursor="TALK"
            className="px-8 py-4 border border-glass-border bg-glass backdrop-blur-glass text-white font-mono text-sm uppercase tracking-widest rounded-full transition-all duration-300 hover:border-white/30 hover:bg-white/10"
          >
            Let's Talk
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        ref={scrollCueRef}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
      >
        <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
      </div>
    </section>
  );
}