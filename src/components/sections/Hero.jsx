
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Code2,
  Copy,
  Mail,
  Smartphone,
  Zap,
} from "lucide-react";

import {
  site,
  socialLinks,
} from "../../config/site";

import { SocialLinks } from "../common/SocialLinks";

/* =========================================================
   CONFIGURATION
========================================================= */

const HEADLINE = "that make work easier.";

const TYPE_DELAY = 320;
const TYPE_SPEED = 65;

const FRONT_HOLD = 5000;
const BACK_HOLD = 4000;
const FLIP_DURATION = 1600;

const focusAreas = [
  {
    title: "Web development",
    description:
      "Websites, dashboards, and web applications built for real-world needs.",
    Icon: Code2,
  },
  {
    title: "Mobile applications",
    description:
      "Useful mobile tools with responsive, intuitive experiences.",
    Icon: Smartphone,
  },
  {
    title: "Automation",
    description:
      "Smarter workflows that reduce repetitive tasks and save time.",
    Icon: Zap,
  },
];

/* =========================================================
   REDUCED MOTION
========================================================= */

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setReducedMotion(media.matches);
    };

    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return reducedMotion;
}

/* =========================================================
   HERO
========================================================= */

export function Hero({ startTyping = true }) {
  const reducedMotion = useReducedMotion();

  const cardRef = useRef(null);

  const [typedCount, setTypedCount] = useState(0);
  const [copyStatus, setCopyStatus] = useState("idle");

  /* Card starts on the picture side. */

  const [flipped, setFlipped] = useState(false);

  /* Record whether a flip has occurred so that the
     1.6-second transition is counted before the next
     side's viewing period. */

  const [hasTurned, setHasTurned] = useState(false);
  const [flipRevision, setFlipRevision] = useState(0);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);

  const paused = hovered || focused;

  const typedText = HEADLINE.slice(0, typedCount);

  const typingComplete =
    typedCount === HEADLINE.length;

  /* =======================================================
     TYPEWRITER — ONCE AFTER SPLASH
  ======================================================= */

  useEffect(() => {
    setTypedCount(0);

    if (!startTyping) return;

    if (reducedMotion) {
      setTypedCount(HEADLINE.length);
      return;
    }

    const timers = [];

    for (
      let index = 1;
      index <= HEADLINE.length;
      index += 1
    ) {
      const timer = window.setTimeout(() => {
        setTypedCount(index);
      }, TYPE_DELAY + index * TYPE_SPEED);

      timers.push(timer);
    }

    return () => {
      timers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    };
  }, [startTyping, reducedMotion]);

  /* =======================================================
     WATCH CARD VISIBILITY

     Don't animate the card continuously while it
     is below the viewport.
  ======================================================= */

  useEffect(() => {
    const element = cardRef.current;

    if (!element) return;

    if (
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* =======================================================
     AUTOMATIC FLIP TIMER

     Front: 5 seconds
     Back: 4 seconds

     Wait until the previous rotation finishes before
     beginning the next side's viewing period.
  ======================================================= */

  useEffect(() => {
    if (!startTyping || paused || !inView) {
      return;
    }

    const holdTime = flipped
      ? BACK_HOLD
      : FRONT_HOLD;

    const transitionTime =
      hasTurned && !reducedMotion
        ? FLIP_DURATION
        : 0;

    const timer = window.setTimeout(() => {
      setFlipped((previous) => !previous);
      setHasTurned(true);
    }, holdTime + transitionTime);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    flipped,
    hasTurned,
    flipRevision,
    paused,
    inView,
    startTyping,
    reducedMotion,
  ]);

  /* =======================================================
     MANUAL FLIP

     Any click on the card works except clicks on
     actual links or other interactive elements.
  ======================================================= */

  const flipCard = () => {
    setFlipped((previous) => !previous);
    setHasTurned(true);

    /* Restart the automatic flip countdown. */
    setFlipRevision((revision) => revision + 1);
  };

  const handleCardClick = (event) => {
    const interactive = event.target.closest(
      "a, button, input, textarea, select, summary"
    );

    if (interactive) return;

    flipCard();
  };

  const handleCardKeyDown = (event) => {
    /* Let links handle their own keyboard events. */

    if (event.target !== event.currentTarget) {
      return;
    }

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      flipCard();
    }
  };

  const handlePointerEnter = (event) => {
    if (
      event.pointerType === "mouse" ||
      event.pointerType === "pen"
    ) {
      setHovered(true);
    }
  };

  const handlePointerLeave = () => {
    setHovered(false);
  };

  const handleBlur = (event) => {
    if (
      !event.currentTarget.contains(
        event.relatedTarget
      )
    ) {
      setFocused(false);
    }
  };

  /* =======================================================
     COPY EMAIL
  ======================================================= */

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(
        site.email
      );

      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2200);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copyStatus]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section
      id="home"
      className={`hero section-grid ${
        startTyping ? "hero-ready" : ""
      }`}
      aria-labelledby="hero-title"
    >
      <span
        id="top"
        className="hero-top-anchor"
        aria-hidden="true"
      />

      {/* =============================================
          INTRODUCTION
      ============================================== */}

      <div className="hero-copy">
        <div className="hero-intro-group">
          <span
            className="hero-intro-line"
            aria-hidden="true"
          />

          <p className="hero-intro">
            Hello, you may call me
          </p>
        </div>

        <h1
          id="hero-title"
          className="hero-name"
        >
          MIKE
          <span className="hero-name-period">
            .
          </span>
        </h1>

        {/* TYPEWRITER */}

        <h2
          className="hero-headline"
          aria-label={`I build websites and apps ${HEADLINE}`}
        >
          <span className="hero-headline-static">
            I build websites and apps
          </span>

          <span
            className={`hero-typed-line ${
              typingComplete ? "is-complete" : ""
            }`}
            aria-hidden="true"
          >
            <span className="hero-typed-text">
              {typedText}
            </span>

            <span
              className="hero-typing-cursor"
            />
          </span>
        </h2>

        <p className="hero-lead">
          I'm a full-stack developer who builds
          practical web and mobile applications.
          I help businesses launch products,
          improve existing systems, and automate
          everyday tasks.
        </p>

        {/* =========================================
            ACTIONS
        ========================================== */}

        <div className="hero-actions">
          <a
            href="#work"
            className="button primary hero-work-button"
          >
            <span>View my work</span>

            <ArrowDownRight
              size={19}
              aria-hidden="true"
            />
          </a>

          <div className="hero-email-group">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(
                "Project Inquiry"
              )}`}
              className="button secondary hero-email-button"
              aria-label={`Email me at ${site.email}`}
            >
              <Mail
                size={19}
                aria-hidden="true"
              />

              <span className="hero-email-text">
                <strong>Email me</strong>

                <small>{site.email}</small>
              </span>

              <ArrowUpRight
                size={17}
                aria-hidden="true"
              />
            </a>

            <button
              type="button"
              className={`hero-copy-email ${
                copyStatus === "copied"
                  ? "is-copied"
                  : ""
              }`}
              onClick={copyEmail}
              aria-label={
                copyStatus === "copied"
                  ? "Email address copied"
                  : "Copy email address"
              }
              title="Copy email address"
            >
              {copyStatus === "copied" ? (
                <Check
                  size={18}
                  aria-hidden="true"
                />
              ) : (
                <Copy
                  size={18}
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>

        <p
          className="hero-copy-feedback"
          role="status"
          aria-live="polite"
        >
          {copyStatus === "copied"
            ? "Email address copied."
            : copyStatus === "error"
              ? "Copy unavailable. Use the email link."
              : ""}
        </p>
      </div>

      {/* =============================================
          AUTOMATIC + MANUAL FLIP CARD
      ============================================== */}

      <aside
        ref={cardRef}
        className={`hero-profile ${
          flipped ? "is-flipped" : ""
        } ${paused ? "is-paused" : ""}`}
        aria-label="Interactive developer profile. Click or press Enter or Space to flip the card."
        role="group"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleCardKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocusCapture={(event) => {
          if (
            event.target !== event.currentTarget ||
            event.currentTarget.matches(":focus-visible")
          ) {
            setFocused(true);
          }
        }}
        onBlurCapture={handleBlur}
      >
        <div className="hero-profile-inner">
          {/* =========================================
              FRONT — PROFILE PHOTO
          ========================================== */}

          <div
            className="hero-profile-face hero-profile-front"
            aria-hidden={flipped}
            inert={flipped}
          >
            <div className="hero-profile-top">
              <span className="hero-profile-eyebrow">
                WHO AM I?
              </span>

              <span className="hero-profile-status">
                <span
                  className="status-dot"
                  aria-hidden="true"
                />

                Available
              </span>
            </div>

            {/* PHOTO */}

            <div className="hero-photo-area">
              <div
                className="hero-photo-decoration"
                aria-hidden="true"
              >
                <span>MR / DEV</span>
                <span>001</span>
              </div>

              <div className="hero-photo-frame">
                <img
                  src="/profile_picture.png"
                  alt="Mike Angelo A. Rubia"
                  className="hero-photo"
                  width="200"
                  height="240"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>

            {/* INFORMATION */}

            <div className="hero-profile-info">
              <p className="hero-profile-role">
                FULL-STACK DEVELOPER
              </p>

              <h3>{site.name}</h3>

              <p className="hero-profile-description">
                Working across frontend,
                backend, and mobile development
                to turn ideas into useful
                applications.
              </p>

              <a
                href="#about"
                className="hero-about-link"
                tabIndex={flipped ? -1 : 0}
              >
                More about me

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                />
              </a>
            </div>

            <div className="hero-card-footer">
              <span className="hero-card-hint">
                CLICK OR TAP TO FLIP
              </span>

              <span
                className="hero-card-flip-symbol"
                aria-hidden="true"
              >
                ↻
              </span>
            </div>
          </div>

          {/* =========================================
              BACK — SPECIALTIES
          ========================================== */}

          <div
            className="hero-profile-face hero-profile-back"
            aria-hidden={!flipped}
            inert={!flipped}
          >
            <div className="hero-profile-top">
              <span className="hero-profile-eyebrow">
                BEHIND THE WORK
              </span>

              <span className="hero-card-back-tag">
                03 FOCUS AREAS
              </span>
            </div>

            <div className="hero-back-content">
              <div className="hero-back-heading">
                <span className="hero-profile-role">
                  WHAT I WORK ON
                </span>

                <h3>
                  Ideas into
                  <span> working solutions.</span>
                </h3>

                <p>
                  From an initial concept to a
                  functional product, I focus
                  on building things people
                  can actually use.
                </p>
              </div>

              <div className="hero-back-services">
                {focusAreas.map(
                  ({
                    title,
                    description,
                    Icon,
                  }, index) => (
                    <div
                      className="hero-back-service"
                      key={title}
                    >
                      <span className="hero-back-service-icon">
                        <Icon
                          size={19}
                          aria-hidden="true"
                        />
                      </span>

                      <div>
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>

                      <span
                        className="hero-back-service-number"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="hero-card-footer">
              <a
                className="hero-back-contact"
                href="#contact"
                tabIndex={!flipped ? -1 : 0}
              >
                Let's work together

                <ArrowUpRight
                  size={16}
                  aria-hidden="true"
                />
              </a>

              <span
                className="hero-card-flip-symbol"
                aria-hidden="true"
              >
                ↻
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* =============================================
          SOCIAL LINKS
      ============================================== */}

      {socialLinks.length > 0 && (
        <div className="hero-social">
          <div className="hero-social-heading">
            <p className="hero-social-label">
              FIND ME ONLINE
            </p>

            <span
              className="hero-social-line"
              aria-hidden="true"
            />
          </div>

          <SocialLinks links={socialLinks} />
        </div>
      )}
    </section>
  );
}
