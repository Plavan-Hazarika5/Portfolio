// src/components/BentoGrid.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGsapFadeIn } from '../hooks/useGsapScroll';

const PROJECTS = [
  {
    id: 1,
    title: 'Smart Inventory AI',
    tag: 'AI · E-Commerce · FastAPI',
    desc: 'AI-powered inventory system for e-commerce with demand prediction and automatic product categorization from images. Features a MongoDB schema optimized for multi-product catalogs.',
    color: '#00e5ff',
    glow: 'rgba(0,229,255,0.25)',
    span: 'md:col-span-2 md:row-span-2',
    year: '2025',
    stack: ['React', 'FastAPI', 'MongoDB', 'Docker', 'GitHub Actions'],
    link: '#',
  },
  {
    id: 2,
    title: 'Service Marketplace',
    tag: 'SaaS · Multi-Tenant · RBAC',
    desc: 'Mini "Urban Company" platform with role-based access control. Customers browse services, vendors manage dashboards, admins see everything. Built with security-first architecture.',
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.25)',
    span: 'md:col-span-1',
    year: '2025',
    stack: ['Next.js', 'PostgreSQL', 'Prisma', 'Tailwind', 'RBAC'],
    link: '#',
  },
  {
    id: 3,
    title: 'Finance Tracker',
    tag: 'React · Dashboard · Charts',
    desc: 'Personal finance dashboard with real-time spending insights, budget tracking, and beautiful Chart.js visualizations. Clean UI with dark mode and category breakdowns.',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    span: 'md:col-span-1',
    year: '2025',
    stack: ['React', 'Chart.js', 'Tailwind', 'LocalStorage'],
    link: '#',
  },
  {
    id: 4,
    title: 'Weather & Mood UI',
    tag: 'API · Animation · UI/UX',
    desc: 'Beautiful weather app with mood-based UI that shifts color palette and animations based on conditions. Framer Motion transitions make every weather change feel cinematic.',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.25)',
    span: 'md:col-span-1',
    year: '2025',
    stack: ['React', 'OpenWeather API', 'Framer Motion', 'GSAP'],
    link: '#',
  },
  {
    id: 5,
    title: 'Local Business Site',
    tag: 'Freelance · Web · Design',
    desc: 'Full-stack website for a local Assamese business — mobile-first, SEO optimized, with online booking and WhatsApp integration. Delivered as a complete freelance project.',
    color: '#88ce02',
    glow: 'rgba(136,206,2,0.25)',
    span: 'md:col-span-2',
    year: '2025',
    stack: ['React', 'Tailwind', 'Figma', 'WhatsApp API'],
    link: '#',
  },
];

// Framer Motion variants
const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    scale: 1.015,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
};

const overlayVariants = {
  hidden: { opacity: 0, scale: 0.97, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

function ProjectCard({ project, onClick }) {
  return (
    <motion.div
      className={`${project.span} relative rounded-2xl overflow-hidden border border-glass-border bg-glass backdrop-blur-glass cursor-pointer group`}
      style={{ minHeight: project.span.includes('row-span-2') ? '380px' : '180px' }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      onClick={() => onClick(project)}
      data-cursor="OPEN"
    >
      {/* Glow layer */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${project.glow} 0%, transparent 70%)`,
        }}
      />

      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30 pointer-events-none" />

      {/* Inner glow border */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0)' }}
        whileHover={{
          boxShadow: `inset 0 0 0 1px ${project.color}55, 0 0 40px ${project.glow}`,
        }}
        transition={{ duration: 0.4 }}
      />

      <div className="relative z-10 h-full flex flex-col justify-between p-6">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
            style={{ color: project.color, borderColor: `${project.color}40`, background: `${project.color}10` }}
          >
            {project.tag}
          </span>
          <span className="font-mono text-xs text-white/30">{project.year}</span>
        </div>

        {/* Bottom */}
        <div>
          <h3
            className="font-heading text-2xl md:text-3xl text-white mb-2 leading-tight"
            style={{ textShadow: `0 0 40px ${project.glow}` }}
          >
            {project.title}
          </h3>
          <p className="font-body text-sm text-white/40 leading-relaxed line-clamp-2">
            {project.desc}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ProjectModal({ project, onClose }) {
  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
          >
            <motion.div
              className="pointer-events-auto w-full max-w-xl rounded-3xl border border-glass-border bg-surface/80 backdrop-blur-glass p-8 shadow-glass relative overflow-hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Ambient top glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 rounded-b-full"
                style={{ background: `linear-gradient(90deg, transparent, ${project.color}, transparent)` }}
              />

              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest mb-2 block"
                    style={{ color: project.color }}
                  >
                    {project.tag}
                  </span>
                  <h2 className="font-heading text-3xl text-white">{project.title}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-full border border-glass-border bg-glass flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Description */}
              <p className="font-body text-white/60 leading-relaxed mb-8">{project.desc}</p>

              {/* Stack pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-xs px-3 py-1.5 rounded-full border border-glass-border bg-glass text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={project.link}
                className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest px-6 py-3 rounded-full transition-all duration-300"
                style={{
                  color: project.color,
                  border: `1px solid ${project.color}40`,
                  background: `${project.color}10`,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${project.color}25`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = `${project.color}10`)}
              >
                View Case Study →
              </a>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default function BentoGrid() {
  const [selected, setSelected] = useState(null);
  const sectionRef = useGsapFadeIn({ y: 50 });

  return (
    <section id="projects" className="py-24 px-6 bg-surface relative">
      {/* Section header */}
      <div ref={sectionRef} className="max-w-6xl mx-auto mb-16">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-xs text-accent-cyan uppercase tracking-[0.3em] mb-3 block">
              Selected Work
            </span>
            <h2 className="font-heading text-5xl md:text-6xl text-white">Projects</h2>
          </div>
          <span className="font-mono text-sm text-white/30 hidden md:block">0{PROJECTS.length} cases</span>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[180px]">
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={setSelected} />
        ))}
      </div>

      {/* Modal via AnimatePresence */}
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  );
}