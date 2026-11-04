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
export const REVIEWED = "4 November 2026";

/** Published Hamster Hour sources the dashboard facts are taken from. */
export const HAMSTER_REPO =
  "https://github.com/identity-md-launches/launch-2336-hamster-hour";
export const HAMSTER_JOB =
  "https://explorer.imd.fun/jobs/863eba48-5cac-4fee-a772-9695de63efd2";

export interface Fact {
  label: string;
  value: string;
  /** Monospace value such as a contract address. */
  code?: boolean;
  /** Where the value itself can be checked, e.g. a block explorer page. */
  href?: string;
  hrefLabel?: string;
  source: string;
  sourceLabel: string;
}

/**
 * Static, sourced facts about Hamster Hour. Not a live feed: each value was
 * read from the listed source on REVIEWED and does not change on its own.
 */
export const HAMSTER_FACTS: Fact[] = [
  {
    label: "Chain",
    value: "Ethereum mainnet (chain ID 1)",
    source: `${HAMSTER_REPO}#readme`,
    sourceLabel: "Hamster Hour README",
  },
  {
    label: "HAMSTER token",
    value: "0x8e7c7936b4f2d4475dc4bacd174dc228d4d24e86",
    code: true,
    href: "https://etherscan.io/token/0x8e7c7936b4f2d4475dc4bacd174dc228d4d24e86",
    hrefLabel: "View token on Etherscan",
    source: HAMSTER_JOB,
    sourceLabel: "IMD launch job",
  },
  {
    label: "HamsterHook",
    value: "0x82f636a92364d13754d7b3e72d460f0be20a28cc",
    code: true,
    href: "https://etherscan.io/address/0x82f636a92364d13754d7b3e72d460f0be20a28cc",
    hrefLabel: "View hook on Etherscan",
    source: HAMSTER_JOB,
    sourceLabel: "IMD launch job",
  },
  {
    label: "Supply",
    value: "1,000,000,000 HAMSTER, fixed (18 decimals)",
    source: `${HAMSTER_REPO}#readme`,
    sourceLabel: "Hamster Hour README",
  },
  {
    label: "Pool",
    value: "HAMSTER / IMD on Uniswap v4: 1.25% LP fee plus 1.1% hook fee",
    source: `${HAMSTER_REPO}#readme`,
    sourceLabel: "Hamster Hour README",
  },
  {
    label: "Launch",
    value: "Deployed through IMD in Ethereum block 26,236,027",
    href: "https://etherscan.io/tx/0x847c6b2faf49eea8f6e36c0327de0041d592eb400755799b57a05778d37fafc3",
    hrefLabel: "View deployment transaction",
    source: HAMSTER_JOB,
    sourceLabel: "IMD launch job",
  },
];
export const PROJECTS: Project[] = [
  {
    id: "hamster-hour",
    name: "Hamster Hour",
    category: "Games",
    description:
      "A token project launched through IMD on Ethereum: the HAMSTER token and a Uniswap v4 hook for its HAMSTER/IMD pool.",
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
