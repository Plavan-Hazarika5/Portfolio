// src/components/TechStack.jsx
import { useEffect, useRef } from 'react';
import { useGsapHorizontalScroll } from '../hooks/useGsapScroll';

const TECHS = [
  { name: 'UI/UX', icon: '◐', level: 80, color: '#ff6b6b' },
  { name: 'Graphic Design', icon: '❋', level: 80, color: '#ff9f43' },
  { name: 'Figma', icon: '◈', level: 85, color: '#f24e1e' },
  { name: 'Framer', icon: '◈', level: 65, color: '#ff0055' },
  { name: 'HTML', icon: '⬡', level: 85, color: '#e34f26' },
  { name: 'CSS', icon: '✦', level: 80, color: '#264de4' },
  { name: 'Tailwind', icon: '✦', level: 75, color: '#06b6d4' },
  { name: 'JavaScript', icon: '⚡', level: 75, color: '#f7df1e' },
  { name: 'React', icon: '⚛', level: 70, color: '#61dafb' },
  { name: 'GSAP', icon: '▲', level: 65, color: '#88ce02' },
  { name: 'Node.js', icon: '⬢', level: 72, color: '#5fa04e' },
  { name: 'Express', icon: 'Ξ', level: 70, color: '#d6d6d6' },
  { name: 'MongoDB', icon: '◍', level: 70, color: '#47a248' },
  { name: 'Git', icon: '⑂', level: 80, color: '#f1502f' },
  { name: 'GitHub', icon: '⌘', level: 80, color: '#ffffff' },
  { name: 'Python', icon: '🐍', level: 80, color: '#3776ab' },
  { name: 'Java', icon: '☕', level: 75, color: '#f89820' },
  { name: 'C++', icon: '⚙', level: 80, color: '#00599c' },
  { name: 'C', icon: '©', level: 80, color: '#a8b9cc' },
];

const BG_COLORS = ['#040407', '#06040f', '#020d14', '#050a04'];

function TechCard({ tech }) {
  return (
    <div
      className="tech-card flex-shrink-0 w-48 md:w-64 rounded-2xl border border-glass-border bg-glass backdrop-blur-glass p-6 relative overflow-hidden group"
      style={{ height: '220px' }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${tech.color}20, transparent 70%)`,
        }}
      />

      {/* Icon */}
      <div
        className="text-3xl mb-4 font-mono leading-none"
        style={{ color: tech.color, textShadow: `0 0 20px ${tech.color}80` }}
      >
        {tech.icon}
      </div>

      {/* Name */}
      <h3 className="font-heading text-xl text-white mb-3">{tech.name}</h3>

      {/* Level bar */}
      <div className="mt-auto">
        <div className="flex justify-between items-center mb-1.5">
          <span className="font-mono text-[10px] text-white/30 uppercase tracking-widest">Proficiency</span>
          <span className="font-mono text-[10px]" style={{ color: tech.color }}>
            {tech.level}%
          </span>
        </div>
        <div className="h-px bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${tech.level}%`,
              background: `linear-gradient(90deg, ${tech.color}40, ${tech.color})`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function TechStack() {
  const { sectionRef, trackRef } = useGsapHorizontalScroll(BG_COLORS);
  const scrollerRef = useRef(null);

  // When the mouse is over the horizontal scroller on desktop,
  // wheel events can get "captured" and force the user to scroll the
  // carousel all the way before the page continues.
  //
  // Behavior:
  // - Normal wheel scrolls the carousel horizontally *while it can*.
  // - Once the carousel hits its start/end, the wheel scroll falls through
  //   and continues the page scroll (no "stuck" feeling).
  // - Shift+wheel or trackpad horizontal gestures behave naturally.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onWheel = (e) => {
      // Let horizontal gestures behave naturally.
      if (e.shiftKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      // Convert vertical wheel into horizontal scroll for the carousel.
      const prevLeft = el.scrollLeft;
      const nextLeft = prevLeft + e.deltaY;
      const maxLeft = el.scrollWidth - el.clientWidth;

      // If we can scroll the carousel further in the wheel direction, consume it.
      const canScroll =
        (e.deltaY > 0 && prevLeft < maxLeft) || (e.deltaY < 0 && prevLeft > 0);

      if (canScroll) {
        e.preventDefault();
        el.scrollLeft = Math.max(0, Math.min(maxLeft, nextLeft));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative overflow-hidden md:overflow-hidden transition-colors duration-100"
      style={{ minHeight: '100vh', backgroundColor: BG_COLORS[0] }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />

      {/* Pinned inner */}
      <div className="relative md:sticky md:top-0 min-h-screen md:h-screen flex flex-col justify-center overflow-hidden">

        {/* Section label */}
        <div className="px-8 md:px-16 mb-10 flex items-end justify-between flex-shrink-0">
          <div>
            <span className="font-mono text-xs text-accent-cyan uppercase tracking-[0.3em] mb-3 block">
              Tools of Trade
            </span>
            <h2 className="font-heading text-5xl md:text-6xl text-white">Tech Stack</h2>
          </div>
          <span className="font-mono text-xs text-white/30 hidden md:block">
            ← Scroll to explore →
          </span>
        </div>

        {/* Horizontal scroll track */}
        <div
          ref={scrollerRef}
          className="overflow-x-auto overflow-y-hidden px-6 md:px-0 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden touch-pan-x"
        >
          <div
            ref={trackRef}
            className="flex gap-4 md:px-16 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {TECHS.map((tech) => (
              <TechCard key={tech.name} tech={tech} />
            ))}

            {/* End spacer card */}
            <div className="flex-shrink-0 w-24 flex items-center justify-center opacity-20">
              <div className="w-px h-24 bg-gradient-to-b from-white/40 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}