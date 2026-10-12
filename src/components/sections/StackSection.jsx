
import { ArrowUpRight } from "lucide-react";

import {
  site,
  stackGroups,
} from "../../config/site";

import { SectionHeading } from "../common/SectionHeading";
import { StackGroup } from "../common/StackGroup";

export function StackSection() {
  return (
    <section
      className="content-section"
      id="stack"
    >
      <SectionHeading
        number="02"
        title="Stack I work with"
        subtitle="A practical toolset for shipping modern web and mobile products."
      />

      <div className="stack-layout">
        <div className="stack-intro" data-reveal>
          <p>
            I choose tools based on the job,
            not just trends. My goal is to keep
            the solution understandable,
            maintainable, and suitable for the
            team or business that will use it.
          </p>

          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
          >
            View GitHub
            <ArrowUpRight
              size={16}
              aria-hidden="true"
            />
          </a>
        </div>

        <div
          className="stack-groups"
          data-reveal
          style={{
            "--reveal-delay": "100ms",
          }}
        >
          {stackGroups.map((group) => (
            <StackGroup
              key={group.title}
              {...group}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
