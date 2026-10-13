
import {
  useEffect,
  useRef,
} from "react";

import {
  ArrowUpRight,
  BriefcaseBusiness,
  Camera,
  Code2,
  Mail,
  Monitor,
  Moon,
  Sun,
  X,
} from "lucide-react";

import { site } from "../../config/site";
import { useTheme } from "../../context/ThemeContext";
import { VisitorAvatars } from "../common/VisitorAvatars";

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
    href: site.email
      ? `mailto:${site.email}`
      : null,
    Icon: Mail,
    external: false,
  },
  {
    label: "GitHub",
    href: site.github,
    Icon: Code2,
    external: true,
  },
  {
    label: "LinkedIn",
    href: site.linkedin,
    Icon: BriefcaseBusiness,
    external: true,
  },
  {
    label: "Instagram",
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
  visitorCount,
  visitors = [],
  visitorStatus = "connecting",
  onClose,
}) {
  const { preference, setPreference } = useTheme();

  const panelRef = useRef(null);
  const closeButtonRef = useRef(null);

  /* =======================================================
     RESTORE KEYBOARD FOCUS
  ======================================================= */

  useEffect(() => {
    if (!open) return;

    const previousFocus = document.activeElement;

    closeButtonRef.current?.focus();

    return () => {
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected
      ) {
        previousFocus.focus();
      }
    };
  }, [open]);

  /* =======================================================
     ESCAPE + FOCUS TRAP
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
    ).filter(
      (element) =>
        element.getClientRects().length > 0
    );

    if (!focusable.length) {
      event.preventDefault();
      return;
    }

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
     RENDER
  ======================================================= */

  return (
    <div className="mobile-drawer">
      {/* BACKDROP */}

      <div
        className="mobile-drawer-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DRAWER PANEL */}

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
          {/* HEADER */}

          <div className="drawer-head">
            <a
              className="drawer-brand"
              href="/#top"
              aria-label={`${site.shortName} home`}
              onClick={onClose}
            >
              <span
                className="drawer-brand-mark"
                aria-hidden="true"
              >
                MR
              </span>

              <span className="drawer-brand-copy">
                <strong>
                  {site.shortName}
                </strong>

                <small>
                  {site.role}
                </small>
              </span>
            </a>

            <button
              ref={closeButtonRef}
              type="button"
              className="drawer-close"
              onClick={onClose}
              aria-label="Close navigation"
            >
              <X
                size={20}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* NAVIGATION */}

          <div className="drawer-nav-block">
            <span className="drawer-section-label">
              NAVIGATION
            </span>

            <nav
              className="drawer-links"
              aria-label="Mobile navigation links"
            >
              {links.map((link, index) => {
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
                    onClick={onClose}
                  >
                    <span className="drawer-link-index">
                      {String(index + 1).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <span className="drawer-link-label">
                      {link.label}
                    </span>

                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                    />
                  </a>
                );
              })}
            </nav>
          </div>

          {/* REAL-TIME VISITORS */}

          <div className="drawer-visitors">
            <span className="drawer-section-label">
              LIVE VISITORS
            </span>

            <VisitorAvatars
              visitorCount={visitorCount}
              visitors={visitors}
              status={visitorStatus}
              variant="drawer"
            />
          </div>

          {/* BOTTOM */}

          <div className="drawer-bottom">
            {/* THEME */}

            <div className="drawer-theme-header">
              <span className="drawer-section-label">
                APPEARANCE
              </span>

              <span className="drawer-theme-current">
                {preference}
              </span>
            </div>

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
                    className={`drawer-theme-option ${
                      preference === value
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPreference(value)
                    }
                    aria-label={label}
                    aria-pressed={
                      preference === value
                    }
                    title={label}
                  >
                    <Icon
                      size={18}
                      aria-hidden="true"
                    />

                    <span>
                      {value}
                    </span>
                  </button>
                )
              )}
            </div>

            {/* CONTACT */}

            {contactLinks.length > 0 && (
              <div className="drawer-contact">
                <span className="drawer-section-label">
                  GET IN TOUCH
                </span>

                <p className="drawer-contact-intro">
                  Have a project or collaboration
                  in mind? Let's connect.
                </p>

                <div className="drawer-contact-links">
                  {contactLinks.map(
                    ({
                      label,
                      href,
                      Icon,
                      external,
                    }) => (
                      <a
                        key={href}
                        href={href}
                        target={
                          external
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          external
                            ? "noopener noreferrer"
                            : undefined
                        }
                        onClick={onClose}
                      >
                        <Icon
                          size={17}
                          aria-hidden="true"
                        />

                        <span>
                          {label}
                        </span>

                        {external && (
                          <ArrowUpRight
                            size={14}
                            aria-hidden="true"
                          />
                        )}
                      </a>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
