
import { ArrowUp } from "lucide-react";
import { site } from "../../config/site";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* MAIN FOOTER */}

        <div className="footer-main">
          <div className="footer-brand">
            <div
              className="footer-logo"
              aria-hidden="true"
            >
              MR
            </div>

            <div className="footer-brand-info">
              <strong>{site.shortName}</strong>
              <span>{site.role}</span>
            </div>
          </div>

          <a
            href="/#top"
            className="footer-back-top"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp
              size={16}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </a>
        </div>

        {/* COPYRIGHT */}

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} {site.name}.
            {" "}All rights reserved.
          </p>

          <span className="footer-credit">
            Designed &amp; developed with care.
          </span>
        </div>
      </div>
    </footer>
  );
}
