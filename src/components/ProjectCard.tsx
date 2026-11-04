import type { Project } from "../data";
import { Icon } from "./Icon";
export function ProjectCard({
  project,
  saved,
  toggle,
}: {
  project: Project;
  saved: boolean;
  toggle: (id: string) => void;
}) {
  return (
    <article className="project-card">
      <div className="project-top">
        <span
          className={`project-mark category-${project.category.toLowerCase()}`}
        >
          {project.id === "hamster-hour" ? (
            <img src="./art/hamster.svg" width="36" height="36" alt="" />
          ) : (
            <Icon name={project.icon} size={25} />
          )}
        </span>
        <button
          className={`save-button icon-button${saved ? " is-saved" : ""}`}
          type="button"
          aria-label={`${saved ? "Unsave" : "Save"} ${project.name}`}
          aria-pressed={saved}
          onClick={() => toggle(project.id)}
        >
          <Icon name="heart" />
        </button>
      </div>
      <h3>
        <a href={project.url} target="_blank" rel="noopener noreferrer">
          {project.name}
          <Icon name="external" size={16} />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </h3>
      <p>{project.description}</p>
      <div className="project-bottom">
        <span>{project.category}</span>
        <a
          className="source-link"
          href={project.source}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Source for ${project.name} (opens in a new tab)`}
        >
          Source <Icon name="external" size={14} />
        </a>
      </div>
    </article>
  );
}
