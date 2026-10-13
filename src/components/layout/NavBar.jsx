
import { useEffect, useState } from "react";

import {
  Menu,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import {
  navigation,
  site,
} from "../../config/site";

import { useTheme } from "../../context/ThemeContext";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useLiveVisitors } from "../../hooks/useLiveVisitors";

import { VisitorAvatars } from "../common/VisitorAvatars";
import { MobileNav } from "./MobileNav";

/* =========================================================
   NAVIGATION CONFIG
========================================================= */

const sectionIds = navigation.map((link) =>
  link.href.replace(/^\/?#/, "")
);

const themeModes = [
  "system",
  "light",
  "dark",
];

const themeIcons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

/* =========================================================
   NAVBAR
========================================================= */

export default function NavBar() {
  const { preference, setPreference } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const activeSection = useActiveSection(
    sectionIds
  );

  /* =======================================================
     REAL-TIME VISITOR DATA
  ======================================================= */

  const {
    visitorCount,
    visitors,
    status: visitorStatus,
  } = useLiveVisitors();

  /* =======================================================
     THEME TOGGLE
  ======================================================= */

  const ThemeIcon =
    themeIcons[preference] ?? Monitor;

  const cycleTheme = () => {
    const index = themeModes.indexOf(
      preference
    );

    const nextIndex =
      (index + 1) % themeModes.length;

    setPreference(themeModes[nextIndex]);
  };

  /* =======================================================
     DRAWER CONTROLS
  ======================================================= */

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    document.body.classList.toggle(
      "menu-open",
      menuOpen
    );

    return () => {
      document.body.classList.remove(
        "menu-open"
      );
    };
  }, [menuOpen]);

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 981px)"
    );

    const handleChange = () => {
      if (media.matches) {
        setMenuOpen(false);
      }
    };

    handleChange();

    media.addEventListener(
      "change",
      handleChange
    );

    return () => {
      media.removeEventListener(
        "change",
        handleChange
      );
    };
  }, []);

  /* =======================================================
     RENDER
  ======================================================= */

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
            onClick={closeMenu}
          >
            <span
              className="brand-mark"
              aria-hidden="true"
            >
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
              const id = link.href.replace(
                /^\/?#/,
                ""
              );

              const isActive =
                activeSection === id;

              const href = link.href.startsWith("/")
                ? link.href
                : `/${link.href}`;

              return (
                <a
                  key={link.href}
                  href={href}
                  className={
                    isActive ? "active" : ""
                  }
                  aria-current={
                    isActive
                      ? "location"
                      : undefined
                  }
                >
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>

          {/* ACTIONS */}

          <div className="nav-actions">
            <VisitorAvatars
              visitorCount={visitorCount}
              visitors={visitors}
              status={visitorStatus}
              variant="navbar"
            />

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
              onClick={() =>
                setMenuOpen(true)
              }
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

      {/* SHARED LIVE VISITORS */}

     <MobileNav
        open={menuOpen}
        links={navigation}
        activeSection={activeSection}
        visitorCount={visitorCount}
        visitors={visitors}
        visitorStatus={visitorStatus}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
