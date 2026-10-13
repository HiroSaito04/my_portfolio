
import { useState } from "react";

import { SplashScreen } from "../components/common/SplashScreen";

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
  const [showSplash, setShowSplash] = useState(true);

  const revealRef = useRevealOnScroll();

  return (
    <>
      {showSplash && (
        <SplashScreen
          onFinish={() => setShowSplash(false)}
        />
      )}

      <div
        className="home-sections"
        ref={revealRef}
      >
        <Hero startTyping={!showSplash} />
        <WorkSection />
        <StackSection />
        <AboutSection />
        <ContactSection />
      </div>
    </>
  );
}
