
import { useEffect, useState } from "react";

export function useActiveSection(ids) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    if (!ids.length) return;

    let frameId = null;

    const updateActiveSection = () => {
      const sections = ids
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!sections.length) {
        setActiveSection("");
        return;
      }

      const navbarHeight =
        document.querySelector(".navbar-shell")
          ?.offsetHeight ?? 66;

      const activationLine = navbarHeight + 40;

      // No navigation item is active while viewing Hero.
      if (
        sections[0].getBoundingClientRect().top >
        activationLine
      ) {
        setActiveSection("");
        return;
      }

      let currentSection = "";

      for (const section of sections) {
        if (
          section.getBoundingClientRect().top <=
          activationLine
        ) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      // Ensure Contact is selected at the bottom.
      const atBottom =
        window.scrollY > 0 &&
        window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 5;

      if (atBottom) {
        currentSection = sections[sections.length - 1].id;
      }

      setActiveSection(currentSection);
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    updateActiveSection();

    window.addEventListener("scroll", scheduleUpdate, {
      passive: true,
    });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    // Recalculate if lazy-loaded content changes.
    const main = document.querySelector(".portfolio-main");

    const observer =
      main && typeof MutationObserver !== "undefined"
        ? new MutationObserver(scheduleUpdate)
        : null;

    observer?.observe(main, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);

      observer?.disconnect();

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [ids]);

  return activeSection;
}
