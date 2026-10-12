
import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  CheckCheck,
  Copy,
} from "lucide-react";

import {
  site,
  socialLinks,
} from "../../config/site";

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
    const success = await copyToClipboard(
      site.email
    );

    if (success) {
      setCopied(true);
      return;
    }

    window.location.href = `mailto:${site.email}`;
  };

  return (
    <section
      className="contact-section"
      id="contact"
      data-reveal
    >
      <div className="contact-kicker">
        04 — contact
      </div>

      <h2>
        Have a business problem that software
        can solve?
      </h2>

      <p>
        I’m open to freelance web, mobile,
        maintenance, and automation work.
        Tell me what you’re trying to improve,
        and I’ll help you work out a practical
        next step.
      </p>

      <div className="contact-email-row">
        <a
          className="contact-email"
          href={`mailto:${site.email}`}
        >
          {site.email}
          <ArrowUpRight
            size={24}
            aria-hidden="true"
          />
        </a>

        <button
          className="copy-button"
          type="button"
          onClick={handleCopy}
          aria-label="Copy email address"
        >
          {copied ? (
            <CheckCheck
              size={17}
              aria-hidden="true"
            />
          ) : (
            <Copy
              size={17}
              aria-hidden="true"
            />
          )}

          {copied ? "Copied" : "Copy email"}
        </button>
      </div>

      <div className="contact-links">
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
    </section>
  );
}
