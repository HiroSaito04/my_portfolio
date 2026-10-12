
import { useEffect, useRef, useState } from "react";

import {
  ArrowUpRight,
  Check,
  Code2,
  ExternalLink,
  ImageIcon,
  Maximize2,
  X,
} from "lucide-react";

/* =========================================================
   PREVIEW CONFIGURATION
========================================================= */

const DESKTOP_WIDTH = 1440;
const DESKTOP_HEIGHT = 900;

const linkTypes = [
  {
    key: "live",
    label: "Visit website",
    Icon: ExternalLink,
  },
  {
    key: "github",
    label: "Source code",
    Icon: Code2,
  },
  {
    key: "demo",
    label: "View demo",
    Icon: ArrowUpRight,
  },
  {
    key: "design",
    label: "View design",
    Icon: ArrowUpRight,
  },
  {
    key: "caseStudy",
    label: "Case study",
    Icon: ArrowUpRight,
  },
];

/* =========================================================
   CONNECTION QUALITY

   Use screenshots when the visitor is offline,
   requests reduced data usage, or has a
   connection explicitly reported as very slow.

   When the Network Information API is unavailable,
   try the video/website normally.
========================================================= */


function isConnectionPoor() {
  if (typeof navigator === "undefined") {
    return false;
  }

  if (!navigator.onLine) {
    return true;
  }

  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  // Respect the visitor's explicit data-saving preference.
  return connection?.saveData === true;
}


function usePoorConnection() {
  const [poorConnection, setPoorConnection] = useState(
    isConnectionPoor
  );

  useEffect(() => {
    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    const refresh = () => {
      setPoorConnection(isConnectionPoor());
    };

    window.addEventListener("online", refresh);
    window.addEventListener("offline", refresh);

    connection?.addEventListener?.("change", refresh);

    return () => {
      window.removeEventListener("online", refresh);
      window.removeEventListener("offline", refresh);

      connection?.removeEventListener?.(
        "change",
        refresh
      );
    };
  }, []);

  return poorConnection;
}

/* =========================================================
   FULL DESKTOP IFRAME

   Always renders as a 1440 × 900 browser
   viewport, scaled to fit its container.

   The container has the same aspect ratio,
   avoiding empty white margins.
========================================================= */

function DesktopWebsitePreview({
  url,
  title,
  onError,
}) {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateWidth = () => {
      setWidth(container.clientWidth);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);

      return () => {
        window.removeEventListener(
          "resize",
          updateWidth
        );
      };
    }

    const observer = new ResizeObserver(updateWidth);

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const scale = width / DESKTOP_WIDTH;

  return (
    <div
      ref={containerRef}
      className="project-desktop-viewport"
      aria-label={`${title} live website preview`}
    >
      <iframe
        src={url}
        title={`${title} live desktop website`}
        className="project-desktop-iframe"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        onError={onError}
        width={DESKTOP_WIDTH}
        height={DESKTOP_HEIGHT}
        style={{
          width: `${DESKTOP_WIDTH}px`,
          height: `${DESKTOP_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          visibility: width > 0 ? "visible" : "hidden",
        }}
      />
    </div>
  );
}

/* =========================================================
   AUTOMATIC RECORDING

   - Autoplay
   - Muted
   - Infinite loop
   - No controls
   - No seek bar
   - No click/pointer interactions
   - Falls back if unavailable or repeatedly stalls
========================================================= */


function ProjectRecording({
  src,
  poster,
  title,
  onFailure,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    // Attempt autoplay without treating a rejected
    // play request as a network failure.
    const startPlayback = () => {
      const promise = video.play();

      promise?.catch(() => {
        // Keep the poster/video element visible.
        // A rejected play() is not necessarily
        // a failed video download.
      });
    };

    startPlayback();

    return () => {
      video.pause();
    };
  }, [src]);

  return (
    <div
      className="project-recording"
      aria-label={`${title} project recording`}
    >
      {poster && (
        <img
          src={poster}
          alt=""
          className="project-media-backdrop"
          aria-hidden="true"
        />
      )}

      <video
        ref={videoRef}
        className="project-video"
        src={src}
        poster={poster || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload noplaybackrate nofullscreen"
        tabIndex={-1}
        aria-hidden="true"
        onError={() => onFailure()}
      />
    </div>
  );
}


/* =========================================================
   IMAGE PREVIEW WITH FULL-SIZE VIEWER

   Particularly useful for:
   - Mobile app screenshots
   - UI/UX designs
   - Graphic designs
   - Website screenshots
========================================================= */

function ProjectImage({
  src,
  alt,
  title,
  onError,
}) {
  const dialogRef = useRef(null);

  const openFullImage = () => {
    dialogRef.current?.showModal();
  };

  const closeFullImage = () => {
    dialogRef.current?.close();
  };

  return (
    <>
      <div className="project-image-area">
        <img
          src={src}
          alt=""
          className="project-media-backdrop"
          aria-hidden="true"
        />

        <img
          src={src}
          alt={alt}
          className="project-image"
          loading="lazy"
          decoding="async"
          onError={onError}
        />

        <button
          type="button"
          className="project-image-expand"
          onClick={openFullImage}
          aria-label={`View full image of ${title}`}
        >
          <Maximize2
            size={16}
            aria-hidden="true"
          />
          <span>View full</span>
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="project-image-dialog"
        aria-label={`${title} full-size preview`}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeFullImage();
          }
        }}
      >
        <button
          type="button"
          className="project-image-dialog-close"
          onClick={closeFullImage}
          aria-label="Close image preview"
        >
          <X size={20} aria-hidden="true" />
        </button>

        <img src={src} alt={alt} />
      </dialog>
    </>
  );
}

/* =========================================================
   PROJECT MEDIA

   Priority on normal connections:
     1. Live iframe if embedding is allowed
     2. Autoplay recording
     3. Screenshot

   When connection is poor:
     1. Screenshot
     2. Placeholder

   No manual preview switching.
========================================================= */

function ProjectMedia({ project }) {
  const preview = project.preview ?? {};
  const links = project.links ?? {};

  const poorConnection = usePoorConnection();

  const liveUrl = links.live || null;
  const videoUrl = preview.video || null;

  const imageUrl =
    preview.image ||
    preview.poster ||
    null;

  const embeddingAllowed =
    preview.embed ??
    preview.allowEmbed ??
    false;

  const canEmbed = Boolean(
    embeddingAllowed && liveUrl
  );

  const [failedLiveUrl, setFailedLiveUrl] =
    useState(null);

  const [failedVideoUrl, setFailedVideoUrl] =
    useState(null);

  const [failedImageUrl, setFailedImageUrl] =
    useState(null);

  const hasLive = Boolean(
    canEmbed &&
    liveUrl !== failedLiveUrl
  );

  const hasVideo = Boolean(
    videoUrl &&
    videoUrl !== failedVideoUrl
  );

  const hasImage = Boolean(
    imageUrl &&
    imageUrl !== failedImageUrl
  );

  const validLayouts = [
    "website",
    "mobile",
    "design",
  ];

  const layout = validLayouts.includes(
    preview.layout
  )
    ? preview.layout
    : "website";

  /* AUTOMATIC MODE SELECTION */

  let mode = "empty";

  if (poorConnection && hasImage) {
    mode = "image";
  } else if (!poorConnection && hasLive) {
    mode = "live";
  } else if (!poorConnection && hasVideo) {
    mode = "video";
  } else if (hasImage) {
    mode = "image";
  }

  const previewLink =
    preview.link ||
    links.design ||
    links.demo ||
    links.caseStudy ||
    links.live ||
    null;

  const imageAlt =
    preview.alt ||
    `${project.name} screenshot`;

  const previewLabel = {
    live: "LIVE DESKTOP PREVIEW",
    video: "AUTOMATIC WALKTHROUGH",
    image: "PROJECT IMAGE",
    empty: "PROJECT PREVIEW",
  }[mode];

  const previewCaption = {
    live: "Live website · Desktop viewport",
    video: "Recorded website demonstration",
    image: "Full-size image available",
    empty: "Preview unavailable",
  }[mode];

  return (
    <div
      className={`project-media project-media--${layout}`}
    >
      {/* HEADER */}

      <div className="project-media-toolbar">
        <span className="project-media-label">
          {previewLabel}
        </span>

        <span className="project-media-device">
          {mode === "live" ? "1440 × 900" : "DESKTOP VIEW"}
        </span>
      </div>

      {/* FULL BLEED PREVIEW */}

      <div className="project-media-stage">
        {mode === "live" ? (
          <DesktopWebsitePreview
            key={liveUrl}
            url={liveUrl}
            title={project.name}
            onError={() => setFailedLiveUrl(liveUrl)}
          />
        ) : mode === "video" ? (
          <ProjectRecording
            key={videoUrl}
            src={videoUrl}
            poster={
              preview.poster ||
              preview.image ||
              null
            }
            title={project.name}
            onFailure={() => {
              setFailedVideoUrl(videoUrl);
            }}
          />
        ) : mode === "image" ? (
          <ProjectImage
            key={imageUrl}
            src={imageUrl}
            alt={imageAlt}
            title={project.name}
            onError={() => {
              setFailedImageUrl(imageUrl);
            }}
          />
        ) : (
          <div className="project-empty-preview">
            <ImageIcon
              size={28}
              aria-hidden="true"
            />

            <strong>{project.name}</strong>

            <span>
              Preview unavailable
            </span>
          </div>
        )}
      </div>

      {/* FOOTER */}

      <div className="project-media-footer">
        <span className="project-media-caption">
          {previewCaption}
        </span>

        {previewLink ? (
          <a
            href={previewLink}
            className="project-media-visit"
            target="_blank"
            rel="noopener noreferrer"
          >
            {liveUrl ? "Live site" : "Open project"}

            <ArrowUpRight
              size={15}
              aria-hidden="true"
            />
          </a>
        ) : (
          <span className="project-media-no-link">
            Preview only
          </span>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

export function ProjectCard({ project, index }) {
  const links = project.links ?? {};

  const availableLinks = linkTypes.filter(
    ({ key }) => Boolean(links[key])
  );

  const projectNumber = String(
    index + 1
  ).padStart(2, "0");

  return (
    <article
      className={`project-card ${
        project.featured
          ? "project-featured"
          : ""
      }`}
      data-reveal
      style={{
        "--reveal-delay": `${Math.min(
          index * 80,
          240
        )}ms`,
      }}
    >
      {/* TEXT COLUMN */}

      <div className="project-copy">
        <div className="project-copy-inner">
          <div className="project-kicker">
            <span>{project.category}</span>

            <span className="project-index">
              {project.featured
                ? "FEATURED"
                : projectNumber}
            </span>
          </div>

          <h3>{project.name}</h3>

          <p className="project-description">
            {project.description}
          </p>

          {project.tags?.length > 0 && (
            <div
              className="tag-row"
              aria-label="Technologies used"
            >
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          )}

          {project.highlights?.length > 0 && (
            <div className="project-notes">
              {project.highlights.map((highlight) => (
                <span key={highlight}>
                  <Check
                    size={16}
                    aria-hidden="true"
                  />

                  {highlight}
                </span>
              ))}
            </div>
          )}

          {availableLinks.length > 0 && (
            <div className="project-links">
              {availableLinks.map(
                ({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={links[key]}
                    className={`project-link ${
                      key === "live"
                        ? "project-link-primary"
                        : ""
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{label}</span>

                    <Icon
                      size={17}
                      aria-hidden="true"
                    />
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* PREVIEW COLUMN */}

      <ProjectMedia project={project} />
    </article>
  );
}
