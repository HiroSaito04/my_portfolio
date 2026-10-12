
import projects from "../../data/projects.json";

import { projectStats } from "../../config/site";
import { SectionHeading } from "../common/SectionHeading";
import { ProjectCard } from "../projects/ProjectCard";

export function WorkSection() {
  return (
    <section
      className="content-section"
      id="work"
    >
      <SectionHeading
        number="01"
        title="Selected work"
        subtitle="Products built around real users, real workflows, and maintainable systems."
      />

      {/* PROJECT METRICS */}

      {projectStats?.length > 0 && (
        <div
          className="metric-strip"
          data-reveal
        >
          {projectStats.map((stat) => (
            <div
              className="metric"
              key={stat.label}
            >
              <strong>{stat.value}</strong>

              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* PROJECT GALLERY */}

      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
