// src/App.jsx
import { useLenis } from './hooks/useLenis';
import CustomCursor from './components/CustomCursor';
import HeroSection from './components/HeroSection';
import BentoGrid from './components/BentoGrid';
import TechStack from './components/TechStack';
import { Navbar, Footer } from './components/NavbarFooter';

export default function App() {
  // Initialize Lenis smooth scroll + GSAP ScrollTrigger bridge
  useLenis();

  return (
    // Dark mode is always on — add `dark` class to html or here
    <div className="dark bg-void text-white antialiased">
      {/* Custom cursor — rendered outside layout flow */}
      <CustomCursor />

      {/* Sticky navigation */}
      <Navbar />

      {/* Page sections */}
      <main>
        <HeroSection />
        <BentoGrid />
        <TechStack />
        <Footer />
      </main>
    </div>
  );
}