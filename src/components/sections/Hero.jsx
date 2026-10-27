
import {
  useCallback,
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
  Rotate3D,
  Smartphone,
  Sparkle,
  Zap,
} from "lucide-react";

import { site, socialLinks } from "../../config/site";
import { SocialLinks } from "../common/SocialLinks";

/* =========================================================
   CONFIGURATION
========================================================= */

const HEADLINE = "that make work easier.";

const TYPE_START = 950;
const TYPE_SPEED = 65;

const PHOTO_HOLD = 5000;
const DETAILS_HOLD = 4000;
const ROTATION_MS = 1600;
const DRAG_SENSITIVITY = 0.9;

const focusAreas = [
  {
    title: "Web development",
    description:
      "Websites, dashboards, and useful web applications.",
    Icon: Code2,
  },
  {
    title: "Mobile Applications",
    description:
      "Practical mobile experiences and everyday tools.",
    Icon: Smartphone,
  },
  {
    title: "Automation",
    description:
      "Better workflows with less repetitive work.",
    Icon: Zap,
  },
  {
    title: "Game Development",
    description:
      "Engaging games for entertainment.",
    Icon: Sparkle,
  },
];

/* =========================================================
   REDUCED MOTION
========================================================= */

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
      : false
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => setReduced(media.matches);

    update();
    media.addEventListener("change", update);

    return () => {
      media.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}

/* =========================================================
   CYLINDER CARD HOOK
========================================================= */

function useProfileCylinder(enabled, reducedMotion) {
  const cardRef = useRef(null);
  const pointerRef = useRef(null);

  const angleRef = useRef(0);
  const autoTimerRef = useRef(null);
  const settleTimerRef = useRef(null);
  const frameRef = useRef(null);
  const suppressClickRef = useRef(false);

  const [angle, setAngle] = useState(0);
  const [activeSide, setActiveSide] = useState(0);

  const [dragging, setDragging] = useState(false);
  const [turning, setTurning] = useState(false);

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [autoRevision, setAutoRevision] = useState(0);

  const clearAuto = useCallback(() => {
    window.clearTimeout(autoTimerRef.current);
    autoTimerRef.current = null;
  }, []);

  const clearSettle = useCallback(() => {
    window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = null;
  }, []);

  const cancelFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  /* =======================================================
     ROTATE / SNAP

     Angles accumulate:
     0, 180, 360, 540, 720...

     Even half-turns show photo.
     Odd half-turns show specialties.
  ======================================================= */

  const rotateTo = useCallback(
    (targetAngle) => {
      clearAuto();
      clearSettle();

      angleRef.current = targetAngle;
      setAngle(targetAngle);

      if (reducedMotion) {
        setActiveSide(Math.round(targetAngle / 180));
        setTurning(false);
        setAutoRevision((value) => value + 1);
        return;
      }

      setTurning(true);

      settleTimerRef.current = window.setTimeout(() => {
        setActiveSide(Math.round(targetAngle / 180));
        setTurning(false);
      }, ROTATION_MS);
    },
    [clearAuto, clearSettle, reducedMotion]
  );

  const showingBack = Math.abs(activeSide % 2) === 1;

  /* =======================================================
     OBSERVE CARD VISIBILITY
  ======================================================= */

  useEffect(() => {
    const node = cardRef.current;

    if (
      !node ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(!document.hidden);
    };

    updateVisibility();

    document.addEventListener(
      "visibilitychange",
      updateVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        updateVisibility
      );
    };
  }, []);

  /* =======================================================
     AUTOMATIC FLIPPING

     Count starts after rotation settles.
     Hover, keyboard focus, and drag pause the timer.
  ======================================================= */

  useEffect(() => {
    clearAuto();

    if (
      !enabled ||
      reducedMotion ||
      dragging ||
      turning ||
      hovered ||
      focused ||
      !inView ||
      !pageVisible
    ) {
      return;
    }

    const delay = showingBack
      ? DETAILS_HOLD
      : PHOTO_HOLD;

    autoTimerRef.current = window.setTimeout(() => {
      const next =
        Math.round(angleRef.current / 180) * 180 +
        180;

      rotateTo(next);
    }, delay);

    return clearAuto;
  }, [
    enabled,
    reducedMotion,
    dragging,
    turning,
    hovered,
    focused,
    inView,
    pageVisible,
    showingBack,
    activeSide,
    autoRevision,
    clearAuto,
    rotateTo,
  ]);

  /* =======================================================
     TAP / CLICK
  ======================================================= */

  const flip = useCallback(
    (direction = 1) => {
      if (dragging || turning) return;

      const next =
        Math.round(angleRef.current / 180) * 180 +
        direction * 180;

      rotateTo(next);
    },
    [dragging, turning, rotateTo]
  );

  const handleClick = (event) => {
    if (suppressClickRef.current) return;

    if (
      event.target.closest(
        "a, button, input, textarea, select"
      )
    ) {
      return;
    }

    flip();
  };

  /* =======================================================
     DRAG / SWIPE
  ======================================================= */

  const handlePointerDown = (event) => {
    if (
      reducedMotion ||
      turning ||
      event.button !== 0 ||
      event.target.closest(
        "a, button, input, textarea, select"
      )
    ) {
      return;
    }

    clearAuto();

    pointerRef.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastTime: performance.now(),
      startAngle: angleRef.current,
      velocity: 0,
      moved: false,
      scrolling: false,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) {
      return;
    }

    const dx = event.clientX - pointer.startX;
    const dy = event.clientY - pointer.startY;

    if (pointer.scrolling) return;

    if (!pointer.moved) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
        return;
      }

      if (Math.abs(dy) > Math.abs(dx) * 1.15) {
        pointer.scrolling = true;
        return;
      }

      pointer.moved = true;
      clearSettle();
      setDragging(true);
    }

    if (event.cancelable) {
      event.preventDefault();
    }

    const now = performance.now();
    const elapsed = Math.max(1, now - pointer.lastTime);

    pointer.velocity =
      (event.clientX - pointer.lastX) / elapsed;

    pointer.lastX = event.clientX;
    pointer.lastTime = now;

    const next = pointer.startAngle + dx * DRAG_SENSITIVITY;

    angleRef.current = next;
    setAngle(next);
  };

  const handlePointerUp = (event) => {
    const pointer = pointerRef.current;

    if (!pointer || pointer.id !== event.pointerId) {
      return;
    }

    pointerRef.current = null;

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }

    if (!pointer.moved) {
      setAutoRevision((value) => value + 1);
      return;
    }

    suppressClickRef.current = true;

    const momentum = Math.max(
      -80,
      Math.min(80, pointer.velocity * 120)
    );

    const projectedAngle = angleRef.current + momentum;

    const snappedAngle =
      Math.round(projectedAngle / 180) * 180;

    setDragging(false);

    /* Restore CSS transitions before snapping. */

    cancelFrame();

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        rotateTo(snappedAngle);
      });
    });

    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 350);
  };

  const handlePointerCancel = () => {
    pointerRef.current = null;

    if (dragging) {
      setDragging(false);
      cancelFrame();

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = window.requestAnimationFrame(() => {
          frameRef.current = null;

          rotateTo(
            Math.round(angleRef.current / 180) * 180
          );
        });
      });
    } else {
      setAutoRevision((value) => value + 1);
    }
  };

  /* =======================================================
     KEYBOARD ACCESS
  ======================================================= */

  const handleKeyDown = (event) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flip();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      flip(1);
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      flip(-1);
    }
  };

  const handleFocus = (event) => {
    if (
      event.target !== event.currentTarget ||
      event.currentTarget.matches(":focus-visible")
    ) {
      setFocused(true);
    }
  };

  const handleBlur = (event) => {
    if (
      !event.currentTarget.contains(event.relatedTarget)
    ) {
      setFocused(false);
    }
  };

  /* =======================================================
     CLEANUP
  ======================================================= */

  useEffect(() => {
    return () => {
      clearAuto();
      clearSettle();
      cancelFrame();
    };
  }, [clearAuto, clearSettle, cancelFrame]);

  return {
    cardRef,
    angle,
    showingBack,
    dragging,
    turning,

    handleClick,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handleKeyDown,
    handleFocus,
    handleBlur,

    onPointerEnter: (event) => {
      if (event.pointerType === "mouse") setHovered(true);
    },

    onPointerLeave: () => setHovered(false),
  };
}

/* =========================================================
   HERO
========================================================= */

export function Hero({ startTyping = true }) {
  const reducedMotion = useReducedMotion();

  const [typedCount, setTypedCount] = useState(0);
  const [copyStatus, setCopyStatus] = useState("idle");

  const cylinder = useProfileCylinder(
    startTyping,
    reducedMotion
  );

  const typedText = HEADLINE.slice(0, typedCount);
  const typingComplete = typedCount === HEADLINE.length;

  /* =======================================================
     TYPEWRITER — RUN ONCE
  ======================================================= */

  useEffect(() => {
    setTypedCount(0);

    if (!startTyping) return;

    if (reducedMotion) {
      setTypedCount(HEADLINE.length);
      return;
    }

    const timers = [];

    for (let i = 1; i <= HEADLINE.length; i += 1) {
      timers.push(
        window.setTimeout(() => {
          setTypedCount(i);
        }, TYPE_START + i * TYPE_SPEED)
      );
    }

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [startTyping, reducedMotion]);

  /* =======================================================
     EMAIL COPY
  ======================================================= */

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  useEffect(() => {
    if (copyStatus === "idle") return;

    const timer = window.setTimeout(() => {
      setCopyStatus("idle");
    }, 2300);

    return () => window.clearTimeout(timer);
  }, [copyStatus]);

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
          HERO INTRODUCTION
      ============================================== */}

      <div className="hero-copy">
        <div className="hero-intro-group">
          <span className="hero-intro-dot" aria-hidden="true" />
          <span className="hero-intro-line" aria-hidden="true" />

          <p className="hero-intro">
            Hello, you may call me
          </p>
        </div>

        <h1
          id="hero-title"
          className="hero-name"
          aria-label="MIKE."
        >
          {"MIKE".split("").map((letter, index) => (
            <span
              key={index}
              className="hero-name-letter"
              style={{
                "--letter-delay": `${140 + index * 110}ms`,
              }}
              aria-hidden="true"
            >
              {letter}
            </span>
          ))}

          <span
            className="hero-name-period"
            aria-hidden="true"
          >
            .
          </span>
        </h1>

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

            <span className="hero-typing-cursor" />
          </span>
        </h2>

        <p className="hero-lead">
          I'm a full-stack developer who builds practical
          web and mobile applications. I help businesses
          launch products, improve existing systems, and
          automate everyday tasks.
        </p>

        {/* =========================================
            ACTIONS
        ========================================== */}

        <div className="hero-actions">
          <a
            href="#work"
            className="button primary hero-work-button"
          >
            View my work
            <ArrowDownRight size={19} aria-hidden="true" />
          </a>

          <div className="hero-email-group">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(
                "Project Inquiry"
              )}`}
              className="button secondary hero-email-button"
            >
              <Mail size={19} aria-hidden="true" />

              <span className="hero-email-text">
                <strong>Email me</strong>
                <small>{site.email}</small>
              </span>

              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <button
              type="button"
              className={`hero-copy-email ${
                copyStatus === "copied" ? "is-copied" : ""
              }`}
              onClick={copyEmail}
              aria-label="Copy email address"
              title="Copy email address"
            >
              {copyStatus === "copied" ? (
                <Check size={18} aria-hidden="true" />
              ) : (
                <Copy size={18} aria-hidden="true" />
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
          INTERACTIVE PROFILE CARD
      ============================================== */}

      <aside
        ref={cylinder.cardRef}
        className={[
          "hero-profile",
          "hero-profile-cylinder",
          cylinder.showingBack ? "is-flipped" : "",
          cylinder.dragging ? "is-dragging" : "",
          cylinder.turning ? "is-turning" : "",
        ].join(" ")}
        role="group"
        tabIndex={0}
        aria-label="Developer profile. Drag, swipe or tap to flip. Enter or arrow keys also rotate the card."
        onClick={cylinder.handleClick}
        onKeyDown={cylinder.handleKeyDown}
        onPointerDown={cylinder.handlePointerDown}
        onPointerMove={cylinder.handlePointerMove}
        onPointerUp={cylinder.handlePointerUp}
        onPointerCancel={cylinder.handlePointerCancel}
        onPointerEnter={cylinder.onPointerEnter}
        onPointerLeave={cylinder.onPointerLeave}
        onFocusCapture={cylinder.handleFocus}
        onBlurCapture={cylinder.handleBlur}
      >
        <div
          className="hero-profile-inner"
          style={{
            transform: `rotateY(${cylinder.angle}deg)`,
          }}
        >
          {/* =====================================
              FRONT SIDE
          ====================================== */}

          <div
            className="hero-profile-face hero-profile-front"
            aria-hidden={cylinder.showingBack}
            inert={cylinder.showingBack}
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

            {/* WIDE PHOTO STAGE */}

            <div className="hero-photo-area">
              <span
                className="hero-photo-grid"
                aria-hidden="true"
              />

              <span
                className="hero-photo-orbit"
                aria-hidden="true"
              />

              <span
                className="hero-photo-orbit hero-photo-orbit-inner"
                aria-hidden="true"
              />

              <div
                className="hero-photo-decoration"
                aria-hidden="true"
              >
                <span>MR / DEV</span>
                <span>001</span>
              </div>

              <img
                src="/profile_picture.png"
                alt="Mike Angelo A. Rubia"
                className="hero-photo"
                width="800"
                height="800"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                draggable="false"
              />

              <span
                className="hero-photo-bottom-line"
                aria-hidden="true"
              />
            </div>

            {/* PROFILE INFORMATION */}

            <div className="hero-profile-info">
              <p className="hero-profile-role">
                FULL-STACK DEVELOPER
              </p>

              <h3>{site.name}</h3>

              <p className="hero-profile-description">
                I build practical digital products,
                connecting frontend, backend, and
                mobile development.
              </p>

              <a href="#about" className="hero-about-link">
                More about me
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>

            <div className="hero-card-footer">
              <span className="hero-card-hint">
                DRAG • SWIPE • TAP TO ROTATE
              </span>

              <Rotate3D
                size={19}
                className="hero-cylinder-icon"
                aria-hidden="true"
              />
            </div>
          </div>

          {/* =====================================
              BACK SIDE
          ====================================== */}

          <div
            className="hero-profile-face hero-profile-back"
            aria-hidden={!cylinder.showingBack}
            inert={!cylinder.showingBack}
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
                  From the first concept to a useful
                  product, I focus on the details
                  that make software work well.
                </p>
              </div>

              <div className="hero-back-services">
                {focusAreas.map(
                  ({ title, description, Icon }, index) => (
                    <div
                      className="hero-back-service"
                      key={title}
                    >
                      <span className="hero-back-service-icon">
                        <Icon size={19} aria-hidden="true" />
                      </span>

                      <div className="hero-back-service-copy">
                        <strong>{title}</strong>
                        <p>{description}</p>
                      </div>

                      <span
                        className="hero-back-service-number"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="hero-card-footer">
              <a
                href="#contact"
                className="hero-back-contact"
              >
                Let's work together
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>

              <Rotate3D
                size={19}
                className="hero-cylinder-icon"
                aria-hidden="true"
              />
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
