import {
  processSteps,
  services,
} from "../../config/site";

import { SectionHeading } from "../common/SectionHeading";
import { ProcessItem } from "../common/ProcessItem";
import { ServiceCard } from "../common/ServiceCard";
import { GitHubActivity } from "../common/GitHubActivity";

export function AboutSection() {
  return (
    <section
      id="about"
      className="content-section about-section"
    >
      <SectionHeading
        number="03"
        title="About"
        subtitle="A little about what I do, how I work, and what I can help you build."
      />

      {/* ===================================================
          INTRODUCTION
      ==================================================== */}

      <div className="about-intro" data-reveal>
        <div className="about-intro-main">
          <span className="about-eyebrow">
            FULL-STACK DEVELOPER
          </span>

          <h3>
            Building digital solutions
            <span> that make sense.</span>
          </h3>
        </div>

        <div className="about-intro-copy">
          <p>
            I'm a developer working across web and
            mobile applications, from frontend
            interfaces to backend systems and
            databases.
          </p>

          <p>
            I enjoy turning ideas into usable
            products, making existing applications
            more reliable, and finding ways to
            simplify everyday work through
            technology.
          </p>

          <p>
            I value clear communication, thoughtful
            implementation, and solutions that
            remain useful beyond launch.
          </p>

          <div
            className="about-capabilities"
            aria-label="Areas I focus on"
          >
            <span>Web applications</span>
            <span>Mobile development</span>
            <span>Backend systems</span>
            <span>Automation</span>
          </div>
        </div>
      </div>

      {/* ===================================================
          DEVELOPMENT PROCESS
      ==================================================== */}

      <div className="about-process">
        <div className="about-block-heading" data-reveal>
          <div>
            <span className="about-eyebrow">
              MY APPROACH
            </span>

            <h3>From an idea to a working product.</h3>
          </div>

          <p>
            A clear process helps keep projects
            focused, understandable, and ready for
            real-world use.
          </p>
        </div>

        <div
          className="process-list"
          data-reveal
          style={{
            "--reveal-delay": "100ms",
          }}
        >
          {processSteps.map((step) => (
            <ProcessItem
              key={step.number}
              {...step}
            />
          ))}
        </div>
      </div>

      {/* ===================================================
          GITHUB CONTRIBUTIONS
      ==================================================== */}

      <GitHubActivity />

      {/* ===================================================
          SERVICES
      ==================================================== */}

      <div className="about-services">
        <div
          className="about-block-heading"
          data-reveal
        >
          <div>
            <span className="about-eyebrow">
              WHAT I OFFER
            </span>

            <h3>
              Ways I can help.
            </h3>
          </div>

          <p>
            Development and technical support
            tailored to the needs of each project.
          </p>
        </div>

        <div className="service-grid" data-reveal>
          {services.map((service) => (
            <ServiceCard
              key={service.number}
              service={service}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
