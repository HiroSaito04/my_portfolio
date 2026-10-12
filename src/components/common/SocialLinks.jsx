
import { ArrowUpRight } from "lucide-react";

/* =========================================================
   SOCIAL LINKS
========================================================= */

export function SocialLinks({
  links,
  className = "social-row",
}) {
  if (!links?.length) return null;

  return (
    <nav
      className={className}
      aria-label="Social profiles"
    >
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          className="social-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit my ${social.label} profile`}
        >
          <span className="social-link-info">
            <strong>{social.label}</strong>
            <small>{social.short}</small>
          </span>

          <ArrowUpRight
            size={17}
            aria-hidden="true"
          />
        </a>
      ))}
    </nav>
  );
}
