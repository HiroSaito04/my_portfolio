
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
        title="My Works"
        subtitle="Deployed works — the spotlighted ones first, then everything else."
      />

  
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
