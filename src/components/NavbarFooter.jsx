import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';

const NAV_LINKS = [
  { label: 'Work', href: '#projects' },
  { label: 'Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/Plavan-Hazarika5',
    icon: FaGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/plavan-hazarika5/',
    icon: FaLinkedinIn,
  },
];

export function Navbar() {
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 1.8, ease: 'expo.out' }
      );
    }

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-4 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/70 backdrop-blur-glass border-b border-glass-border shadow-glass'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <a
          href="#"
          className="font-display text-2xl text-white tracking-widest hover:text-accent-cyan transition-colors duration-300"
          data-cursor="HOME"
        >
          PLAVAN<span className="text-accent-cyan">.</span>DEV
        </a>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors duration-300 relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent-cyan group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </div>

        {/* Status + Socials */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-glass-border text-white/40 hover:text-white hover:border-accent-cyan/60 hover:bg-white/5 transition-all duration-300"
              >
                <s.icon className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="sr-only">{s.label}</span>
              </a>
            ))}
          </div>
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]" />
          <span className="font-mono text-xs text-white/40 hidden md:block">
            Open to remote projects
          </span>
        </div>
      </div>
    </nav>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative py-32 px-6 bg-void border-t border-glass-border overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center bottom, rgba(124,58,237,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-6xl mx-auto">
        
        {/* CTA */}
        <div className="text-center mb-20">
          <span className="font-mono text-xs text-accent-cyan uppercase tracking-[0.3em] mb-4 block">
            Let's Build Together
          </span>

          <h2 className="font-display text-[clamp(3rem,10vw,8rem)] text-white leading-none mb-8">
            SAY HELLO
          </h2>

          <a
            href="mailto:plavanhazarika5@gmail.com"
            data-cursor="EMAIL"
            className="group inline-block font-body text-xl md:text-2xl text-white/40 hover:text-white transition-colors duration-500"
          >
            plavanhazarika5@gmail.com
            <span className="block h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-glass-border">
          
          <span className="font-mono text-xs text-white/20">
            © 2026 Plavan Hazarika — Built with React, GSAP & Framer Motion
          </span>

          <div className="flex items-center gap-4">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-glass-border text-white/40 hover:text-white hover:border-accent-cyan/60 hover:bg-white/5 transition-all duration-300"
              >
                <s.icon className="w-4 h-4" aria-hidden="true" />
                <span className="sr-only">{s.label}</span>
              </a>
            ))}
          </div>

        </div>
      </div>
    </footer>
  );
}