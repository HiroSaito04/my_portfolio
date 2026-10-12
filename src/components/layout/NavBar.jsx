
import { useEffect, useState } from "react";
import { Menu, Monitor, Moon, Sun } from "lucide-react";

import { navigation, site } from "../../config/site";
import { useTheme } from "../../context/ThemeContext";
import { useActiveSection } from "../../hooks/useActiveSection";
import { MobileNav } from "./MobileNav";

const sectionIds = navigation.map((link) =>
  link.href.replace(/^#/, "")
);

const themeModes = ["system", "light", "dark"];

const themeIcons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export default function NavBar({ visitorCount = null }) {
  const { preference, setPreference } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const activeSection = useActiveSection(sectionIds);

  const ThemeIcon = themeIcons[preference] ?? Monitor;

  const cycleTheme = () => {
    const index = themeModes.indexOf(preference);
    const nextIndex = (index + 1) % themeModes.length;

    setPreference(themeModes[nextIndex]);
  };

  // Lock body scrolling while the mobile drawer is open.
  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  // Close the drawer when switching to desktop.
  useEffect(() => {
    const media = window.matchMedia("(min-width: 981px)");

    const handleChange = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    media.addEventListener("change", handleChange);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <>
      <header className="navbar-shell">
        <nav
          className="topbar"
          aria-label="Main navigation"
        >
          {/* BRAND */}

          <a
            className="brand"
            href="/#top"
            aria-label={`${site.shortName} home`}
            onClick={() => setMenuOpen(false)}
          >
            <span className="brand-mark" aria-hidden="true">
              MR
            </span>

            <span className="brand-copy">
              <strong>{site.shortName}</strong>
              <small>{site.role}</small>
            </span>
          </a>

          {/* DESKTOP LINKS */}

          <div className="desktop-nav">
            {navigation.map((link) => {
              const id = link.href.replace(/^#/, "");
              const isActive = activeSection === id;

              return (
                <a
                  key={link.href}
                  href={`/${link.href}`}
                  className={isActive ? "active" : ""}
                  aria-current={
                    isActive ? "location" : undefined
                  }
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* ACTIONS */}

          <div className="nav-actions">
            <button
              type="button"
              className="icon-button theme-toggle"
              onClick={cycleTheme}
              aria-label={`Current theme: ${preference}. Change theme`}
              title={`Theme: ${preference}`}
            >
              <ThemeIcon
                size={19}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              className="icon-button menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <Menu
                size={21}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav
        open={menuOpen}
        links={navigation}
        activeSection={activeSection}
        visitorCount={visitorCount}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
