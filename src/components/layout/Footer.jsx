
import { ArrowUpRight, ArrowUp } from "lucide-react";

import { site } from "../../config/site";

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">

        {/* ===============================================
            MAIN FOOTER
        ================================================ */}

        <div className="footer-main">

          {/* BRAND */}

          <div className="footer-brand">
            <div className="footer-logo" aria-hidden="true">
              MR
            </div>

            <div className="footer-brand-info">
              <strong>{site.shortName}</strong>
              <span>{site.role}</span>
            </div>
          </div>

          {/* DESCRIPTION */}

          <p className="footer-description">
            Designed to turn technical capability
            into business trust.
          </p>

          {/* BACK TO TOP */}

          <a
            href="/#top"
            className="footer-back-top"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp size={16} aria-hidden="true" />
          </a>

        </div>

        {/* ===============================================
            FOOTER BOTTOM
        ================================================ */}

        <div className="footer-bottom">

          {/* COPYRIGHT */}

          <p className="footer-copyright">
            © {currentYear} {site.name}.
            All rights reserved.
          </p>

          {/* EMAIL */}

          <a
            href={`mailto:${site.email}`}
            className="footer-email"
          >
            Get in touch
            <ArrowUpRight
              size={15}
              aria-hidden="true"
            />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
