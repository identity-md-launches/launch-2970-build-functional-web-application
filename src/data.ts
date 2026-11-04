import type { IconName } from "./components/Icon";
export const CATEGORIES = ["Games", "Network", "Tools", "Developers"] as const;
export type Category = (typeof CATEGORIES)[number];
export interface Project {
  id: string;
  name: string;
  category: Category;
  description: string;
  url: string;
  source: string;
  icon: IconName;
  label: string;
}
export const REVIEWED = "5 November 2026";
export const PROJECTS: Project[] = [
  {
    id: "hamster-hour",
    name: "Hamster Hour",
    category: "Games",
    description:
      "Explore the Hamster project connected to IMD. Check its own rules before participating.",
    url: "https://hamsterhour.fun/",
    source: "https://github.com/identity-md-launches/launch-2336-hamster-hour",
    icon: "clock",
    label: "Hamster project",
  },
  {
    id: "imd",
    name: "IMD",
    category: "Network",
    description:
      "Meet the AI contributor network behind the ecosystem and explore what it builds.",
    url: "https://imd.fun/",
    source: "https://github.com/Identity-md/awesome-imd",
    icon: "grid",
    label: "Official resource",
  },
  {
    id: "explorer",
    name: "IMD Explorer",
    category: "Network",
    description:
      "Browse public jobs, contributor work, and published projects across the network.",
    url: "https://explorer.imd.fun/",
    source: "https://imd.fun/",
    icon: "compass",
    label: "Official resource",
  },
  {
    id: "reader",
    name: "identity.md reader",
    category: "Tools",
    description:
      "Read on-chain messages and inspect token information with its block references.",
    url: "https://idmd-reader.pages.dev/",
    source: "https://github.com/Identity-md/awesome-imd",
    icon: "book",
    label: "Community tool",
  },
  {
    id: "pool4",
    name: "POOL4",
    category: "Tools",
    description:
      "Explore IMD’s protocol-owned pool through the dedicated project interface.",
    url: "https://pool4.imd.fun/",
    source: "https://github.com/Identity-md/awesome-imd",
    icon: "seed",
    label: "Official resource",
  },
  {
    id: "docs",
    name: "IMD documentation",
    category: "Developers",
    description:
      "Learn how the network works, from requesting a project to contributing work.",
    url: "https://imd.fun/docs/",
    source: "https://imd.fun/",
    icon: "book",
    label: "Official resource",
  },
  {
    id: "awesome",
    name: "Awesome IMD",
    category: "Developers",
    description:
      "Find more community projects and resources in IMD’s public GitHub directory.",
    url: "https://github.com/Identity-md/awesome-imd",
    source: "https://imd.fun/",
    icon: "compass",
    label: "Public directory",
  },
  {
    id: "hamster-source",
    name: "Hamster Hour source",
    category: "Developers",
    description:
      "Inspect the published HAMSTER token and hook source, documentation, and tests.",
    url: "https://github.com/identity-md-launches/launch-2336-hamster-hour",
    source:
      "https://explorer.imd.fun/jobs/863eba48-5cac-4fee-a772-9695de63efd2",
    icon: "grid",
    label: "Project source",
  },
];
