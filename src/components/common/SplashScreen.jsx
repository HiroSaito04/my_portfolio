
import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   SPLASH CONFIGURATION
========================================================= */

const TITLE = "MIKE PORTFOLIO";

const AVATAR_COUNT = 5;

const TYPE_START = 800;
const TYPE_SPEED = 82;

const BURST_START = 2950;
const EXIT_START = 3450;
const FINISH_TIME = 4050;

const ENTRANCE_DIRECTIONS = [
  "from-left",
  "from-right",
  "from-top",
  "from-bottom",
  "from-top-left",
  "from-top-right",
];

/* =========================================================
   RANDOM UTILITIES
========================================================= */

function randomInteger(max) {
  if (
    typeof crypto !== "undefined" &&
    crypto.getRandomValues
  ) {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }

  return Math.floor(Math.random() * max);
}

/* =========================================================
   SYSTEM THEME
========================================================= */

function getSystemIsDark() {
  if (typeof window === "undefined") {
    return true;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
}

function useSystemIsDark() {
  const [isDark, setIsDark] = useState(
    getSystemIsDark
  );

  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const update = () => {
      setIsDark(query.matches);
    };

    update();

    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

/* =========================================================
   REDUCED MOTION
========================================================= */

function getReducedMotion() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    getReducedMotion
  );

  useEffect(() => {
    const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const update = () => {
      setReduced(query.matches);
    };

    update();

    query.addEventListener("change", update);

    return () => {
      query.removeEventListener("change", update);
    };
  }, []);

  return reduced;
}

/* =========================================================
   DECORATIVE ENERGY PARTICLES

   Small, varied geometric shapes:
   sparks, diamonds, lines, crosses, and pixels.

   Positions are deterministic to avoid changing
   the layout during React re-renders.
========================================================= */

function seededValue(index, multiplier) {
  const value = Math.sin(
    index * multiplier * 19.173
  ) * 43758.5453;

  return value - Math.floor(value);
}

const energyParticles = Array.from(
  { length: 44 },
  (_, index) => {
    const x = seededValue(index + 1, 2.1);
    const y = seededValue(index + 1, 3.7);
    const speed = seededValue(index + 1, 4.9);

    const variants = [
      "square",
      "diamond",
      "dash",
      "cross",
      "spark",
    ];

    return {
      id: index,

      type: variants[index % variants.length],

      style: {
        "--px": `${8 + x * 84}%`,
        "--py": `${8 + y * 84}%`,

        "--size": `${3 + (index % 4) * 2}px`,

        "--duration": `${2.1 + speed * 3.2}s`,
        "--delay": `${-index * 0.19}s`,

        "--travel-x": `${Math.round(
          (x - 0.5) * 110
        )}px`,

        "--travel-y": `${Math.round(
          -25 - y * 110
        )}px`,
      },
    };
  }
);

/* =========================================================
   EXPLOSION FRAGMENTS

   Radial offsets make the fragments shoot away
   from the central mascot.
========================================================= */

const explosionFragments = Array.from(
  { length: 56 },
  (_, index) => {
    const angle =
      ((index * 137.508) % 360) *
      (Math.PI / 180);

    const distance =
      130 + seededValue(index + 1, 6.3) * 530;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    return {
      id: index,

      style: {
        "--tx": `${x.toFixed(1)}px`,
        "--ty": `${y.toFixed(1)}px`,

        "--rotation": `${
          (index % 2 ? 1 : -1) *
          (90 + index * 13)
        }deg`,

        "--fragment-size": `${
          3 + (index % 5) * 2
        }px`,

        "--fragment-delay": `${
          (index % 7) * 24
        }ms`,
      },
    };
  }
);

/* =========================================================
   ANIMATED TITLE
========================================================= */

function AnimatedWord({
  word,
  visibleCount,
  className,
}) {
  return (
    <span className={className} aria-hidden="true">
      {word.split("").map((letter, index) => (
        <span
          key={`${word}-${index}`}
          className={`splash-letter ${
            index < visibleCount
              ? "is-visible"
              : ""
          }`}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

/* =========================================================
   SCREEN CRACK GRAPHIC
========================================================= */

function ScreenCrack() {
  return (
    <svg
      className="splash-crack"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g className="splash-crack-lines">
        <path d="M500 350 L462 290 L486 235 L425 171 L441 70" />

        <path d="M500 350 L560 316 L615 252 L703 239 L760 158 L885 100" />

        <path d="M500 350 L543 411 L520 465 L601 550 L592 656" />

        <path d="M500 350 L428 394 L367 381 L298 457 L186 447 L92 530" />

        <path d="M462 290 L390 265 L341 205 L257 190" />

        <path d="M560 316 L584 367 L684 404 L732 462" />

        <path d="M428 394 L406 495 L352 579" />

        <path d="M520 465 L470 531 L485 630" />

        <path d="M486 235 L527 180 L521 96" />

        <path d="M615 252 L644 166 L630 75" />
      </g>
    </svg>
  );
}

/* =========================================================
   MAIN SPLASH
========================================================= */

export function SplashScreen({ onFinish }) {
  const { preference } = useTheme();

  const systemIsDark = useSystemIsDark();
  const reducedMotion = useReducedMotion();

  const finishRef = useRef(onFinish);

  const [phase, setPhase] = useState("intro");

  const [visibleCharacters, setVisibleCharacters] =
    useState(0);

  const [avatarIndex] = useState(
    () => randomInteger(AVATAR_COUNT) + 1
  );

  const [direction] = useState(
    () =>
      ENTRANCE_DIRECTIONS[
        randomInteger(ENTRANCE_DIRECTIONS.length)
      ]
  );

  /* =======================================================
     KEEP LATEST FINISH CALLBACK
  ======================================================= */

  useEffect(() => {
    finishRef.current = onFinish;
  }, [onFinish]);

  /* =======================================================
     RESOLVE AVATAR THEME
  ======================================================= */

  const activeTheme =
    preference === "light"
      ? "light"
      : preference === "dark"
        ? "dark"
        : systemIsDark
          ? "dark"
          : "light";

  const avatarSrc =
    `/avatars/${activeTheme}/visitor-` +
    `${String(avatarIndex).padStart(2, "0")}.png`;

  /* =======================================================
     LOCK SCROLL
  ======================================================= */

  useEffect(() => {
    document.body.classList.add("splash-open");

    return () => {
      document.body.classList.remove(
        "splash-open"
      );
    };
  }, []);

  /* =======================================================
     ANIMATION TIMELINE
  ======================================================= */

  useEffect(() => {
    const timers = [];

    const schedule = (callback, delay) => {
      const timer = window.setTimeout(
        callback,
        delay
      );

      timers.push(timer);
    };

    /* Accessibility: short, static transition */

    if (reducedMotion) {
      setVisibleCharacters(TITLE.length);

      schedule(() => {
        setPhase("exit");
      }, 650);

      schedule(() => {
        finishRef.current?.();
      }, 900);

      return () => {
        timers.forEach(window.clearTimeout);
      };
    }

    /* Begin the avatar charge animation */

    schedule(() => {
      setPhase("charged");
    }, 650);

    /* Type MIKE PORTFOLIO */

    for (
      let index = 1;
      index <= TITLE.length;
      index += 1
    ) {
      schedule(() => {
        setVisibleCharacters(index);
      }, TYPE_START + index * TYPE_SPEED);
    }

    /* Screen crack + flash + radial explosion */

    schedule(() => {
      setPhase("burst");
    }, BURST_START);

    /* Glitch/dissolve the screen */

    schedule(() => {
      setPhase("exit");
    }, EXIT_START);

    /* Remove splash completely */

    schedule(() => {
      finishRef.current?.();
    }, FINISH_TIME);

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [reducedMotion]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
      <div
        className={[
            "splash-screen",
            `splash-${phase}`,
            reducedMotion ? "splash-reduced" : "",
        ].join(" ")}
        data-splash-theme={activeTheme}
        role="status"
        aria-label="MIKE PORTFOLIO"
        aria-live="off"
        >

      {/* =============================================
          ATMOSPHERE
      ============================================== */}

      <div
        className="splash-atmosphere"
        aria-hidden="true"
      >
        <div className="splash-grid" />

        <div className="splash-vignette" />

        <div className="splash-scan-beam" />

        <div className="splash-energy-halo" />
      </div>

      {/* =============================================
          MOVING DIGITAL PARTICLES
      ============================================== */}

      <div
        className="splash-particle-field"
        aria-hidden="true"
      >
        {energyParticles.map((particle) => (
          <span
            key={particle.id}
            className={`splash-energy-particle splash-energy-${particle.type}`}
            style={particle.style}
          />
        ))}
      </div>

      {/* =============================================
          CENTRAL POWER RINGS
      ============================================== */}

      <div
        className="splash-power-field"
        aria-hidden="true"
      >
        <span className="splash-power-ring splash-power-ring-1" />

        <span className="splash-power-ring splash-power-ring-2" />

        <span className="splash-power-ring splash-power-ring-3" />

        <span className="splash-power-crosshair" />
      </div>

      {/* =============================================
          MASCOT + TEXT
      ============================================== */}

      <div className="splash-center">
        {/* MASCOT */}

        <div className="splash-mascot-stage">
          <div
            className={`splash-mascot-entrance ${direction}`}
          >
            <div className="splash-mascot-float">
              <div className="splash-mascot-flip">
                <img
                  src={avatarSrc}
                  alt=""
                  className="splash-mascot-image"
                  draggable="false"
                  fetchPriority="high"
                />
              </div>
            </div>
          </div>

          <span
            className="splash-mascot-ground"
            aria-hidden="true"
          />
        </div>

        {/* ANIMATED TITLE */}

        <h1
          className="splash-title"
          aria-label={TITLE}
        >
          <AnimatedWord
            word="MIKE"
            className="splash-title-primary"
            visibleCount={Math.min(
              4,
              visibleCharacters
            )}
          />

          <AnimatedWord
            word="PORTFOLIO"
            className="splash-title-secondary"
            visibleCount={Math.max(
              0,
              visibleCharacters - 5
            )}
          />

          <span
            className="splash-title-cursor"
            aria-hidden="true"
          />
        </h1>
      </div>

      {/* =============================================
          PIXEL EXPLOSION
      ============================================== */}

      <div
        className="splash-explosion"
        aria-hidden="true"
      >
        {explosionFragments.map((fragment) => (
          <span
            className="splash-fragment"
            key={fragment.id}
            style={fragment.style}
          />
        ))}
      </div>

      {/* =============================================
          SCREEN CRACK + IMPACT FLASH
      ============================================== */}

      <ScreenCrack />

      <div
        className="splash-impact-flash"
        aria-hidden="true"
      />

      {/* =============================================
          DIGITAL EXIT WIPE
      ============================================== */}

      <div
        className="splash-exit-panel splash-exit-panel-top"
        aria-hidden="true"
      />

      <div
        className="splash-exit-panel splash-exit-panel-bottom"
        aria-hidden="true"
      />
    </div>
  );
}
