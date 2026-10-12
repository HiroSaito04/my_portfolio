
import { useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
} from "lucide-react";

import { site, socialLinks } from "../../config/site";
import { SocialLinks } from "../common/SocialLinks";

const focusAreas = [
  {
    title: "Web development",
    description: "Websites, dashboards, and web applications.",
  },
  {
    title: "Mobile applications",
    description: "Practical mobile experiences and tools.",
  },
  {
    title: "Automation",
    description: "Less repetitive work and better workflows.",
  },
];

export function Hero() {
  const [copyStatus, setCopyStatus] = useState("idle");

  const copyEmail = async () => {
    if (!navigator.clipboard?.writeText) {
      setCopyStatus("error");
      return;
    }

    try {
      await navigator.clipboard.writeText(site.email);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  };

  return (
    <section
      id="home"
      className="hero section-grid"
      aria-labelledby="hero-title"
    >
      {/* INTRODUCTION */}

      <div className="hero-copy" data-reveal>
        <p className="hero-intro">
          Hello, you may call me
        </p>

        <h1 id="hero-title" className="hero-name">
          M I K E.
        </h1>

        <h2 className="hero-headline">
          I build websites and apps
          <span> that make work easier.</span>
        </h2>

        <p className="hero-lead">
          I'm a full-stack developer who builds
          practical web and mobile applications.
          I help businesses launch products,
          improve existing systems, and automate
          everyday tasks.
        </p>

        {/* ACTIONS */}

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
              aria-label={`Email me at ${site.email}`}
            >
              <Mail size={20} aria-hidden="true" />

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
              className="hero-copy-email"
              onClick={copyEmail}
              aria-label="Copy email address"
              title="Copy email address"
            >
              {copyStatus === "copied" ? (
                <Check size={19} aria-hidden="true" />
              ) : (
                <Copy size={19} aria-hidden="true" />
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
              ? "Copy unavailable. You can select the email address above."
              : ""}
        </p>

        {/* SOCIAL LINKS */}

        <div className="hero-social">
          <p className="hero-social-label">
            Find me online
          </p>

          <SocialLinks links={socialLinks} />
        </div>
      </div>

      {/* PROFILE CARD */}

      <aside
        className="hero-profile"
        aria-label="Developer profile"
        data-reveal
        style={{ "--reveal-delay": "100ms" }}
      >
        <div className="hero-profile-top">
          <span>WHO AM I?</span>

          <span className="hero-profile-status">
            <span className="status-dot" aria-hidden="true" />
            Available
          </span>
        </div>

        <div className="hero-profile-body">
          {/* PORTRAIT */}

          <div className="hero-photo-area">
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

          {/* DETAILS */}

          <div className="hero-profile-info">
            <p className="hero-profile-role">
              FULL STACK DEVELOPER
            </p>

            <h3>{site.name}</h3>

            <p className="hero-profile-description">
              Working across frontend, backend, and
              mobile development to turn ideas into
              useful applications.
            </p>

            <a
              href="#about"
              className="hero-about-link"
            >
              More about me
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* EXPANDABLE DETAILS */}

        <details className="hero-focus-details">
          <summary>
            <span>What I work on</span>
            <span className="hero-focus-indicator" aria-hidden="true">
              +
            </span>
          </summary>

          <div className="hero-focus-list">
            {focusAreas.map((area) => (
              <div className="hero-focus-item" key={area.title}>
                <strong>{area.title}</strong>
                <p>{area.description}</p>
              </div>
            ))}
          </div>
        </details>
      </aside>
    </section>
  );
}
