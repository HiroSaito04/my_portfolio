
/* =========================================================
   VISITOR AVATAR GRAPHICS
========================================================= */

const avatarGraphics = [
  "👩‍💻",
  "🧑‍🚀",
  "👨‍🎨",
  "👩‍🔬",
  "🧑‍💻",
];

/* =========================================================
   LIVE VISITOR DISPLAY
========================================================= */

export function VisitorAvatars({
  visitorCount,
  visitors = [],
  status = "connecting",
  variant = "navbar",
}) {
  const connected = status === "connected";

  const visibleVisitors = connected
    ? visitors.slice(0, 3)
    : [];

  const count = connected
    ? visitorCount ?? 0
    : null;

  const statusLabel =
    status === "connecting"
      ? "Connecting"
      : status === "unconfigured"
        ? "Not configured"
        : status === "error"
          ? "Reconnecting"
          : "online";

  const accessibleLabel = connected
    ? `${count} ${
        count === 1 ? "visitor" : "visitors"
      } online now`
    : `Visitor status: ${statusLabel}`;

  return (
    <div
      className={`visitor-presence visitor-presence--${variant} ${
        connected ? "is-connected" : ""
      }`}
      role="status"
      aria-label={accessibleLabel}
    >
      {/* AVATARS */}

      {visibleVisitors.length > 0 && (
        <div
          className="visitor-presence-avatars"
          aria-hidden="true"
        >
          {visibleVisitors.map((visitor) => {
            const avatarIndex =
              Math.abs(visitor.avatarIndex) %
              avatarGraphics.length;

            return (
              <span
                className={`visitor-presence-avatar visitor-presence-avatar--${avatarIndex}`}
                key={visitor.id}
              >
                {avatarGraphics[avatarIndex]}
              </span>
            );
          })}
        </div>
      )}

      {/* COUNT */}

      <div className="visitor-presence-info">
        <span
          className="visitor-presence-dot"
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
