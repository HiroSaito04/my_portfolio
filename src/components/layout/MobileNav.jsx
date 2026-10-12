
import { useEffect, useRef } from "react";

import {
  BriefcaseBusiness,
  Camera,
  Code2,
  Mail,
  Monitor,
  Moon,
  Sun,
  UserRound,
  X,
} from "lucide-react";

import { site } from "../../config/site";
import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   THEME OPTIONS
========================================================= */

const themeOptions = [
  {
    value: "system",
    label: "System theme",
    Icon: Monitor,
  },
  {
    value: "light",
    label: "Light theme",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark theme",
    Icon: Moon,
  },
];

/* =========================================================
   CONTACT LINKS
========================================================= */

const contactLinks = [
  {
    label: site.email,
    href: `mailto:${site.email}`,
    Icon: Mail,
    external: false,
  },
  {
    label: "GitHub · HiroSaito04",
    href: site.github,
    Icon: Code2,
    external: true,
  },
  {
    label: "LinkedIn · mikearubia",
    href: site.linkedin,
    Icon: BriefcaseBusiness,
    external: true,
  },
  {
    label: "Instagram · _zhiroark",
    href: site.instagram,
    Icon: Camera,
    external: true,
  },
].filter((link) => Boolean(link.href));

/* =========================================================
   MOBILE NAVIGATION
========================================================= */

export function MobileNav({
  open,
  links,
  activeSection,
  visitorCount = null,
  onClose,
}) {
  const { preference, setPreference } = useTheme();

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  /* =======================================================
     FOCUS MANAGEMENT
  ======================================================= */

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;

    closeButtonRef.current?.focus();

    return () => {
      previousFocus?.focus?.();
    };
  }, [open]);

  /* =======================================================
     KEYBOARD SUPPORT
  ======================================================= */

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = Array.from(
      panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled])'
      ) ?? []
    );

    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === first
    ) {
      event.preventDefault();
      last.focus();
    } else if (
      !event.shiftKey &&
      document.activeElement === last
    ) {
      event.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  /* =======================================================
     VISITORS
  ======================================================= */

  const hasVisitorCount =
    Number.isInteger(visitorCount) &&
    visitorCount >= 0;

  const displayCount = hasVisitorCount
    ? visitorCount
    : "—";

  const visitorLabel =
    visitorCount === 1
      ? "person viewing now"
      : "people viewing now";

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="mobile-drawer">
      {/* BACKDROP */}

      <div
        className="mobile-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* SIDE PANEL */}

      <aside
        ref={panelRef}
        id="mobile-navigation"
        className="mobile-drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        onKeyDown={handleKeyDown}
      >
        <div className="drawer-inner">
          {/* =============================================
              HEADER
          ============================================== */}

          <div className="drawer-head">
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
              <strong>{site.name}</strong>
            </span>
          </a>
          
            <button
              ref={closeButtonRef}
              type="button"
              className="icon-button drawer-close"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>

          {/* =============================================
              NAVIGATION LINKS
          ============================================== */}

          <nav
            className="drawer-links"
            aria-label="Mobile navigation links"
          >
            {links.map((link) => {
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
                  onClick={onClose}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* =============================================
              VISITORS
          ============================================== */}

          <section
            className="drawer-visitors"
            aria-label="Site visitors"
          >
            <div
              className="visitor-avatars"
              aria-hidden="true"
            >
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  className={`visitor-avatar visitor-avatar-${index}`}
                >
                  <UserRound size={15} />
                </span>
              ))}
            </div>

            <p className="visitor-status">
              <strong>{displayCount}</strong>
              <span>{visitorLabel}</span>
            </p>
          </section>

          {/* =============================================
              THEME AND CONTACT
          ============================================== */}

          <section className="drawer-bottom">
            {/* THEME */}

            <div
              className="drawer-theme-switch"
              role="group"
              aria-label="Color theme"
            >
              {themeOptions.map(
                ({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className="drawer-theme-option"
                    onClick={() => setPreference(value)}
                    aria-label={label}
                    aria-pressed={preference === value}
                    title={label}
                  >
                    <Icon
                      size={17}
                      aria-hidden="true"
                    />
                  </button>
                )
              )}
            </div>

            {/* CONTACT */}

            <p className="drawer-contact-intro">
              For work, collaborations & everything
              else, reach me at
            </p>

            <div className="drawer-contact-links">
              {contactLinks.map(
                ({ label, href, Icon, external }) => (
                  <a
                    key={href}
                    href={href}
                    target={
                      external ? "_blank" : undefined
                    }
                    rel={
                      external
                        ? "noopener noreferrer"
                        : undefined
                    }
                    onClick={onClose}
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                    />

                    <span>{label}</span>
                  </a>
                )
              )}
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
