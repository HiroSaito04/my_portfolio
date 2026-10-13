
import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  Send,
} from "lucide-react";

import {
  site,
  socialLinks,
} from "../../config/site";

import { CommentsSection } from "../common/CommentsSection";
import { copyToClipboard } from "../../utils/clipboard";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 1800);

    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  const handleCopy = async () => {
    const success = await copyToClipboard(site.email);

    if (success) {
      setCopied(true);
    } else {
      window.location.href = `mailto:${site.email}`;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || "").trim();
    const message = String(form.get("message") || "").trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const mailto = [
      `mailto:${site.email}`,
      `?subject=${encodeURIComponent(subject)}`,
      `&body=${encodeURIComponent(body)}`,
    ].join("");

    // Opens the visitor's email application.
    // It does not send an email automatically.
    window.location.href = mailto;
  };

  return (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-layout">
        {/* =========================================
            LEFT — INTRODUCTION
        ========================================== */}

        <div className="contact-content" data-reveal>
          <div className="contact-kicker">
            <span className="contact-kicker-dot" />
            04 / CONTACT
          </div>

          <h2 id="contact-title">
            Have something
            <br />
            <span>in mind?</span>
            <br />
            Let's build it.
          </h2>

          <p className="contact-description">
            Have a project idea, a website that
            needs improvement, or a technical
            challenge to solve? Tell me what
            you're working on, and let's see
            how I can help.
          </p>

          {/* EMAIL */}

          <div className="contact-info">
            <span className="contact-info-label">
              REACH ME DIRECTLY
            </span>

            <div className="contact-email-row">
              <Mail
                size={20}
                aria-hidden="true"
              />

              <a
                href={`mailto:${site.email}`}
                className="contact-email"
              >
                {site.email}
              </a>

              <button
                type="button"
                className="contact-copy"
                onClick={handleCopy}
                aria-label={
                  copied
                    ? "Email address copied"
                    : "Copy email address"
                }
                title={
                  copied
                    ? "Copied"
                    : "Copy email"
                }
              >
                {copied ? (
                  <Check
                    size={16}
                    aria-hidden="true"
                  />
                ) : (
                  <Copy
                    size={16}
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>
          </div>

          {/* SOCIAL LINKS */}

          {socialLinks.length > 0 && (
            <div className="contact-socials">
              <span className="contact-info-label">
                ELSEWHERE
              </span>

              <div className="contact-social-list">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}

                    <ArrowUpRight
                      size={15}
                      aria-hidden="true"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* =========================================
            RIGHT — ENQUIRY FORM
        ========================================== */}

        <div
          className="contact-form-wrap"
          data-reveal
          style={{
            "--reveal-delay": "100ms",
          }}
        >
          <div className="contact-form-top">
            <div>
              <span className="contact-form-eyebrow">
                START A CONVERSATION
              </span>

              <h3>Tell me about your project.</h3>
            </div>

            <span
              className="contact-form-symbol"
              aria-hidden="true"
            >
              <ArrowUpRight size={22} />
            </span>
          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >
            <div className="contact-form-row">
              {/* NAME */}

              <div className="contact-field">
                <label htmlFor="contact-name">
                  NAME <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  maxLength={100}
                />
              </div>

              {/* EMAIL */}

              <div className="contact-field">
                <label htmlFor="contact-email-input">
                  EMAIL <span aria-hidden="true">*</span>
                </label>

                <input
                  id="contact-email-input"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  maxLength={254}
                />
              </div>
            </div>

            {/* SUBJECT */}

            <div className="contact-field">
              <label htmlFor="contact-subject">
                SUBJECT <span aria-hidden="true">*</span>
              </label>

              <input
                id="contact-subject"
                name="subject"
                type="text"
                placeholder="What would you like to discuss?"
                required
                maxLength={150}
              />
            </div>

            {/* MESSAGE */}

            <div className="contact-field">
              <label htmlFor="contact-message">
                MESSAGE <span aria-hidden="true">*</span>
              </label>

              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell me a little about your project, goals, or the problem you're trying to solve..."
                rows={7}
                required
                minLength={10}
              />
            </div>

            {/* SUBMIT */}

            <div className="contact-form-footer">
              <button
                className="contact-submit"
                type="submit"
              >
                <span>Compose enquiry</span>

                <Send
                  size={17}
                  aria-hidden="true"
                />
              </button>

              <p className="contact-form-note">
                Opens your email app to send
                the message.
              </p>
            </div>
     
          </form>
        </div>
      </div>
      <CommentsSection />
    </section>
  );
}
