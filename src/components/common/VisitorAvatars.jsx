
import { useEffect, useState } from "react";

import { useTheme } from "../../context/ThemeContext";

/* =========================================================
   CONFIGURATION
========================================================= */

const AVATAR_COUNT = 5;
const MAX_VISIBLE_AVATARS = 3;

/* =========================================================
   SYSTEM COLOR PREFERENCE
========================================================= */

function getSystemDarkMode() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
}

function useSystemDarkMode() {
  const [systemDark, setSystemDark] = useState(
    getSystemDarkMode
  );

  useEffect(() => {
    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const updateTheme = () => {
      setSystemDark(media.matches);
    };

    updateTheme();

    media.addEventListener("change", updateTheme);

    return () => {
      media.removeEventListener(
        "change",
        updateTheme
      );
    };
  }, []);

  return systemDark;
}

/* =========================================================
   THEME-AWARE AVATAR PATH
========================================================= */

function getAvatarSrc(avatarIndex, theme) {
  const safeIndex =
    Number.isInteger(avatarIndex) &&
    avatarIndex >= 0 &&
    avatarIndex < AVATAR_COUNT
      ? avatarIndex
      : 0;

  const number = String(
    safeIndex + 1
  ).padStart(2, "0");

  return `/avatars/${theme}/visitor-${number}.png`;
}

/* =========================================================
   VISITOR AVATARS
========================================================= */

export function VisitorAvatars({
  visitorCount = null,
  visitors = [],
  status = "connecting",
  variant = "navbar",
}) {
  const { preference } = useTheme();

  const systemDark = useSystemDarkMode();

  /* =======================================================
     RESOLVE ACTIVE THEME
  ======================================================= */

  const activeTheme =
    preference === "dark"
      ? "dark"
      : preference === "light"
        ? "light"
        : systemDark
          ? "dark"
          : "light";

  /* =======================================================
     VISITOR DATA
  ======================================================= */

  const connected = status === "connected";

  const count = connected
    ? visitorCount ?? 0
    : null;

  const visibleVisitors = connected
    ? visitors.slice(0, MAX_VISIBLE_AVATARS)
    : [];

  const statusLabel = connected
    ? "online"
    : status === "connecting"
      ? "connecting"
      : status === "unconfigured"
        ? "offline"
        : "reconnecting";

  const accessibleLabel = connected
    ? `${count} ${
        count === 1 ? "visitor" : "visitors"
      } online now`
    : `Visitor counter ${statusLabel}`;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className={`visitor-presence visitor-presence--${variant} ${
        connected ? "is-connected" : ""
      }`}
      role="status"
      aria-label={accessibleLabel}
    >
      {/* =============================================
          MASCOT AVATARS
      ============================================== */}

      {visibleVisitors.length > 0 && (
        <div
          className="visitor-presence-avatars"
          aria-hidden="true"
        >
          {visibleVisitors.map((visitor) => (
            <span
              className="visitor-presence-avatar"
              key={visitor.id}
            >
              <img
                src={getAvatarSrc(
                  visitor.avatarIndex,
                  activeTheme
                )}
                alt=""
                width={48}
                height={48}
                loading="eager"
                draggable="false"
              />
            </span>
          ))}
        </div>
      )}

      {/* =============================================
          LIVE COUNT
      ============================================== */}

      <div className="visitor-presence-info">
        <span
          className={`visitor-presence-dot ${
            connected ? "is-online" : ""
          }`}
          aria-hidden="true"
        />

        <strong className="visitor-presence-count">
          {count === null
            ? "—"
            : count.toLocaleString()}
        </strong>

        <span className="visitor-presence-label">
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
