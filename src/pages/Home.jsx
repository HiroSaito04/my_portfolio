
import { Hero } from "../components/sections/Hero";

import { WorkSection } from "../components/sections/WorkSection";
import { StackSection } from "../components/sections/StackSection";
import { AboutSection } from "../components/sections/AboutSection";
import { ContactSection } from "../components/sections/ContactSection";

import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

/* =========================================================
   HOME PAGE
========================================================= */

export function Home() {
  const revealRef = useRevealOnScroll();

  return (
    <div className="home-sections" ref={revealRef}>
      <Hero />

      <WorkSection />
      <StackSection />
      <AboutSection />
      <ContactSection />
      
    </div>
  );
}
