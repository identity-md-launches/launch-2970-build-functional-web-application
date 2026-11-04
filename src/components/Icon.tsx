export type IconName =
  | "arrow"
  | "external"
  | "play"
  | "pause"
  | "grid"
  | "book"
  | "compass"
  | "search"
  | "heart"
  | "close"
  | "menu"
  | "chevron"
  | "left"
  | "right"
  | "trophy"
  | "clock"
  | "check"
  | "seed"
  | "restart"
  | "download"
  | "info";
const paths: Record<IconName, string> = {
  arrow: "M4 12h15m-6-6 6 6-6 6",
  external: "M14 4h6v6m0-6-9 9M10 4H4v16h16v-6",
  play: "m9 5 11 7-11 7Z",
  pause: "M8 5v14M16 5v14",
  grid: "M4 4h6v6H4Zm10 0h6v6h-6ZM4 14h6v6H4Zm10 0h6v6h-6Z",
  book: "M12 6c-2-2-6-3-10-2v15c4-1 8 0 10 2m0-15c2-2 6-3 10-2v15c-4-1-8 0-10 2Zm0 0v15",
  compass: "M9 9 17 7l-2 8-8 2Zm3-7a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
  search: "M16 16l5 5M10.5 3a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Z",
  heart: "M12 21S2 15 2 8a5 5 0 0 1 10-1A5 5 0 0 1 22 8c0 7-10 13-10 13Z",
  close: "m6 6 12 12M6 18 18 6",
  menu: "M4 6h16M4 12h16M4 18h16",
  chevron: "m8 4 8 8-8 8",
  left: "m14 5-7 7 7 7M7 12h14",
  right: "m10 5 7 7-7 7M17 12H3",
  trophy:
    "M7 3h10v7a5 5 0 0 1-10 0ZM7 5H3v3a5 5 0 0 0 5 5m9-8h4v3a5 5 0 0 1-5 5m-4 2v6m-5 0h10",
  clock: "M12 8v5l3 2m-3-13a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
  check: "m5 12 4 4L19 6",
  seed: "M7 9c-4 8 2 13 5 13s9-5 5-13ZM5 9h14V6H5Zm7-3V2h3",
  restart: "M4 11a8 8 0 1 1 1 6M4 4v7h7",
  download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
  info: "M12 11v6m0-10v.01M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z",
};
export function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconName;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={`icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
