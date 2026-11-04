import { useEffect, useRef, useState } from "react";
import { Icon } from "./components/Icon";
import type { IconName } from "./components/Icon";
import { ProjectCard } from "./components/ProjectCard";
import { Game } from "./components/Game";
import {
  CATEGORIES,
  HAMSTER_FACTS,
  HAMSTER_REPO,
  PROJECTS,
  REVIEWED,
} from "./data";
import { loadSaved, loadStats, persist } from "./storage";
import type { PersonalStats } from "./storage";

type Page = "home" | "dashboard" | "arcade" | "directory" | "about";
const NAV: { id: Page; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "arcade", label: "Arcade" },
  { id: "directory", label: "Directory" },
  { id: "about", label: "About" },
];
function route(): Page {
  const key = window.location.hash.replace(/^#\/?/, "").split("?")[0];
  return NAV.some((item) => item.id === key) ? (key as Page) : "home";
}
function HeroArt() {
  return (
    <div
      className="hero-art"
      aria-label="A pixel-art hamster in a cozy autumn valley"
      role="img"
    >
      <img
        className="hero-valley"
        src="./art/valley.svg"
        alt=""
        fetchPriority="high"
      />
      <img className="hero-hamster pixel" src="./art/hamster.svg" alt="" />
      <img
        className="hero-acorn acorn-one pixel"
        src="./art/acorn.svg"
        alt=""
      />
      <img
        className="hero-acorn acorn-two pixel"
        src="./art/acorn.svg"
        alt=""
      />
      <img
        className="hero-acorn acorn-three pixel"
        src="./art/acorn.svg"
        alt=""
      />
      <span className="scene-corner corner-tl" />
      <span className="scene-corner corner-tr" />
      <span className="scene-corner corner-bl" />
      <span className="scene-corner corner-br" />
    </div>
  );
}
function PageHeading({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <h1>{title}</h1>
      <p>{children}</p>
    </div>
  );
}
function External({
  href,
  children,
  className = "text-link",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Icon name="external" size={16} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
function Home({
  saved,
  toggle,
  stats,
}: {
  saved: string[];
  toggle: (id: string) => void;
  stats: PersonalStats;
}) {
  const paths: {
    icon: IconName;
    title: string;
    description: string;
    link: Page;
    action: string;
    className: string;
  }[] = [
    {
      icon: "grid",
      title: "Dashboard",
      description:
        "See Hamster Hour at a glance and keep track of your saves and scores.",
      link: "dashboard",
      action: "Open dashboard",
      className: "path-peach",
    },
    {
      icon: "compass",
      title: "Project directory",
      description:
        "Discover Hamster projects, useful tools, and places to start.",
      link: "directory",
      action: "Explore the directory",
      className: "path-olive",
    },
    {
      icon: "book",
      title: "About Hamster and IMD",
      description: "Get to know Hamster, IMD, and the network connecting them.",
      link: "about",
      action: "Get to know Hamster",
      className: "path-sand",
    },
  ];
  return (
    <>
      <section className="hero content-width">
        <div className="hero-copy">
          <h1>
            Catch acorns.
            <br />
            <span>Find Hamster.</span>
          </h1>
          <p>
            Hamster Hub is a pocket arcade game, a link directory and a
            dashboard for Hamster Hour and IMD.
          </p>
          <div className="hero-actions">
            <a href="#/arcade" className="button primary">
              <Icon name="play" />
              Play Nut Dash
            </a>
            <a href="#/directory" className="button secondary">
              Explore projects
              <Icon name="arrow" />
            </a>
          </div>
        </div>
        <HeroArt />
      </section>
      <div className="hub-strip content-width">
        <div>
          <Icon name="compass" />
          <span>
            <strong>{PROJECTS.length}</strong> ecosystem resources
          </span>
        </div>
        <div>
          <Icon name="heart" />
          <span>
            <strong>{saved.length}</strong> saved projects
          </span>
        </div>
        <div>
          <Icon name="trophy" />
          <span>
            Personal best <strong>{stats.best}</strong>
          </span>
        </div>
        <a href="#/dashboard">
          Your dashboard
          <Icon name="arrow" size={16} />
        </a>
      </div>
      <section className="section content-width">
        <div className="section-heading">
          <div>
            <h2>Start here</h2>
            <p>A few good places to start your adventure.</p>
          </div>
        </div>
        <div className="path-grid">
          {paths.map((path) => (
            <a
              className={`path-card ${path.className}`}
              key={path.link}
              href={`#/${path.link}`}
            >
              <Icon name={path.icon} size={28} />
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <span className="path-action">
                {path.action}
                <Icon name="arrow" size={18} />
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="section featured-section content-width">
        <div className="section-heading">
          <div>
            <h2>Featured projects</h2>
            <p>Start with Hamster. See where the trail takes you.</p>
          </div>
          <a className="text-link" href="#/directory">
            View all projects
            <Icon name="arrow" size={18} />
          </a>
        </div>
        <div className="project-grid">
          {PROJECTS.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              saved={saved.includes(project.id)}
              toggle={toggle}
            />
          ))}
        </div>
      </section>
      <section className="imd-band content-width">
        <div className="imd-mark" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div>
          <h2>About Hamster Hub</h2>
          <p>
            Hamster Hub is an independent companion for discovering Hamster and
            the IMD contributor network.
          </p>
        </div>
        <a href="#/about" className="button secondary">
          About the hub
          <Icon name="arrow" />
        </a>
      </section>
    </>
  );
}
function Directory({
  saved,
  toggle,
}: {
  saved: string[];
  toggle: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [savedOnly, setSavedOnly] = useState(false);
  const filtered = PROJECTS.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      (!savedOnly || saved.includes(p.id)) &&
      `${p.name} ${p.description} ${p.category}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  const reset = () => {
    setSearch("");
    setCategory("All");
    setSavedOnly(false);
  };
  return (
    <div className="content-width page-content">
      <PageHeading title="Hamster and IMD project directory">
        A small directory of Hamster projects and useful IMD resources.
      </PageHeading>
      <div className="directory-toolbar">
        <div className="search-field">
          <label htmlFor="project-search">Find a project</label>
          <div className="search-input">
            <Icon name="search" />
            <input
              id="project-search"
              type="search"
              placeholder="Search projects, tools, resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
        <button
          className={`button secondary saved-filter${savedOnly ? " selected" : ""}`}
          type="button"
          aria-pressed={savedOnly}
          onClick={() => setSavedOnly(!savedOnly)}
        >
          <Icon name="heart" />
          Saved ({saved.length})
        </button>
      </div>
      <div className="filter-row" aria-label="Project categories">
        {["All", ...CATEGORIES].map((c) => (
          <button
            className={`filter-button${category === c ? " active" : ""}`}
            type="button"
            key={c}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
            <span>
              {c === "All"
                ? PROJECTS.length
                : PROJECTS.filter((p) => p.category === c).length}
            </span>
          </button>
        ))}
      </div>
      <div className="directory-summary">
        <p role="status">
          {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
          {search.trim()
            ? ` matching “${search.trim()}”`
            : savedOnly
              ? " in your saved collection"
              : " to explore"}
        </p>
        <span>Links reviewed {REVIEWED}</span>
      </div>
      {filtered.length > 0 ? (
        <div className="project-grid directory-grid">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              saved={saved.includes(project.id)}
              toggle={toggle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name={savedOnly ? "heart" : "search"} size={40} />
          <h2>
            {savedOnly && !search
              ? "Your stash starts here."
              : "No resources found."}
          </h2>
          <p>
            {savedOnly && !search
              ? "Save a project with its heart button to find it here."
              : "Try a different search or clear your filters to see every resource."}
          </p>
          <button type="button" className="button secondary" onClick={reset}>
            Clear filters
            <Icon name="arrow" />
          </button>
        </div>
      )}
      <div className="resource-note">
        <Icon name="info" />
        <p>
          This is a resource map, not a project endorsement. External sites set
          their own rules. Each listing includes its source; availability can
          change.
        </p>
      </div>
    </div>
  );
}
function Dashboard({
  saved,
  stats,
  toggle,
}: {
  saved: string[];
  stats: PersonalStats;
  toggle: (id: string) => void;
}) {
  const savedProjects = PROJECTS.filter((p) => saved.includes(p.id));
  return (
    <div className="content-width page-content">
      <PageHeading title="Dashboard">
        Explore the ecosystem and keep an eye on your own adventures.
      </PageHeading>
      <div className="dashboard-note">
        <Icon name="info" />
        <span>
          Published Hamster Hour facts + activity in this browser. No live
          blockchain feed.
        </span>
      </div>
      <div className="stats-grid">
        {[
          {
            icon: "compass",
            value: PROJECTS.length,
            label: "Listed resources",
            sub: "Browse the directory",
            href: "#/directory",
          },
          {
            icon: "heart",
            value: saved.length,
            label: "Saved projects",
            sub: "Find them below",
            href: "#saved-projects",
          },
          {
            icon: "trophy",
            value: stats.best,
            label: "Personal best",
            sub: "Beat it in Nut Dash",
            href: "#/arcade",
          },
          {
            icon: "seed",
            value: stats.nuts,
            label: "Acorns collected",
            sub: `${stats.rounds} completed ${stats.rounds === 1 ? "round" : "rounds"}`,
            href: "#/arcade",
          },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <Icon name={item.icon as IconName} />
            <strong className="stat-number">{item.value}</strong>
            <span className="stat-label">{item.label}</span>
            <a
              href={item.href}
              onClick={
                item.href === "#saved-projects"
                  ? (e) => {
                      e.preventDefault();
                      document
                        .getElementById("saved-projects")
                        ?.scrollIntoView({
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "instant"
                            : "smooth",
                        });
                      document
                        .getElementById("saved-projects")
                        ?.focus({ preventScroll: true });
                    }
                  : undefined
              }
            >
              {item.sub}
              <Icon name="arrow" size={14} />
            </a>
          </div>
        ))}
      </div>
      <div className="dashboard-columns">
        <section className="resource-map" aria-labelledby="hamster-facts">
          <div className="section-heading">
            <div>
              <h2 id="hamster-facts">Hamster Hour at a glance</h2>
              <p>Published facts, checked {REVIEWED}.</p>
            </div>
            <Icon name="clock" size={28} />
          </div>
          <dl className="fact-list">
            {HAMSTER_FACTS.map((fact) => (
              <div className="fact-row" key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {fact.code ? (
                    <code className="fact-code">{fact.value}</code>
                  ) : (
                    <span className="fact-value">{fact.value}</span>
                  )}
                  <span className="fact-links">
                    {fact.href && (
                      <External href={fact.href} className="fact-link">
                        {fact.hrefLabel}
                      </External>
                    )}
                    <External href={fact.source} className="fact-link">
                      Source: {fact.sourceLabel}
                    </External>
                  </span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="caption">
            Values as of {REVIEWED}, not a live feed. Always confirm addresses
            on the block explorer before you use them.
          </p>
        </section>
        <section className="personal-panel">
          <div className="section-heading">
            <div>
              <h2>Your Nut Dash stash</h2>
              <p>A little progress goes a long way.</p>
            </div>
            <img src="./art/acorn.svg" width="44" height="44" alt="" />
          </div>
          {stats.recent.length > 0 ? (
            <>
              <h3>
                Last {stats.recent.length}{" "}
                {stats.recent.length === 1 ? "round" : "rounds"}
              </h3>
              <ol className="recent-scores">
                {stats.recent.map((score, index) => (
                  <li key={index}>
                    <span>
                      {index === 0
                        ? "Most recent"
                        : `${index} ${index === 1 ? "round" : "rounds"} ago`}
                    </span>
                    <strong>{score} points</strong>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <div className="stash-empty">
              <img src="./art/hamster.svg" width="72" height="72" alt="" />
              <p>
                Your first haul is waiting.
                <br />
                Play a round to start your game history.
              </p>
            </div>
          )}
          <a className="button secondary" href="#/arcade">
            {stats.rounds ? "Play another round" : "Play your first round"}
            <Icon name="play" size={18} />
          </a>
        </section>
      </div>
      <section className="section saved-section">
        <div className="section-heading">
          <div>
            <h2 id="saved-projects" tabIndex={-1}>
              Saved for later
            </h2>
            <p>Your favorite trails, all in one place.</p>
          </div>
          <a className="text-link" href="#/directory">
            Browse projects
            <Icon name="arrow" size={16} />
          </a>
        </div>
        {savedProjects.length ? (
          <div className="project-grid">
            {savedProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                saved
                toggle={toggle}
              />
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <Icon name="heart" size={28} />
            <p>
              No saved projects yet. Use a heart in the directory to build your
              stash.
            </p>
            <a href="#/directory" className="text-link">
              Find a project
              <Icon name="arrow" size={16} />
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
function Arcade({
  stats,
  complete,
}: {
  stats: PersonalStats;
  complete: (score: number, nuts: number) => void;
}) {
  return (
    <div className="content-width page-content arcade-content">
      <div className="arcade-heading">
        <PageHeading title="Nut Dash">
          Take a 30-second break with Nut Dash, our little browser game.
        </PageHeading>
        <span className="best-label">
          <Icon name="trophy" />
          Personal best: <strong>{stats.best}</strong>
        </span>
      </div>
      <div className="arcade-layout">
        <Game best={stats.best} onComplete={complete} />
        <aside className="game-guide">
          <h2>How to play</h2>
          <div className="guide-row">
            <img src="./art/acorn.svg" alt="" width="44" height="44" />
            <div>
              <h3>Catch acorns</h3>
              <p>Each one adds 10 points to your stash.</p>
            </div>
          </div>
          <div className="guide-row">
            <img src="./art/rock.svg" alt="" width="44" height="44" />
            <div>
              <h3>Dodge rocks</h3>
              <p>A bump costs a heart. You start with three.</p>
            </div>
          </div>
          <div className="guide-row">
            <Icon name="clock" size={36} />
            <div>
              <h3>Make 30 seconds count</h3>
              <p>The pace picks up as your round goes on.</p>
            </div>
          </div>
          <div className="game-local-note">
            <Icon name="info" size={18} />
            <p>
              Just for fun. Scores stay in this browser. Acorns are game points
              with no token value.
            </p>
          </div>
          <details>
            <summary>Keyboard & accessibility</summary>
            <p>
              Use Left / Right or A / D to move. Press P or Escape to pause. You
              can also Tab to the movement buttons and press Enter. The game
              pauses when you leave the tab.
            </p>
            <p>
              The game uses visual, timed play. Results are announced, but the
              falling items are not narrated.
            </p>
          </details>
        </aside>
      </div>
    </div>
  );
}
function About() {
  return (
    <div className="content-width page-content about-content">
      <PageHeading title="About Hamster and IMD">
        An independent companion to Hamster and the world of IMD.
      </PageHeading>
      <div className="about-grid">
        <section className="about-story">
          <h2>Welcome to the burrow.</h2>
          <p>
            Hamster Hub gives you a comfortable place to explore Hamster
            projects, find useful resources, and take a little play break along
            the way.
          </p>
          <p>
            Start with Hamster Hour, follow a trail through the directory, or
            collect a pocketful of acorns in Nut Dash. Your saved links and game
            history live right here in your browser.
          </p>
          <a className="text-link" href="#/directory">
            Find your first trail
            <Icon name="arrow" size={18} />
          </a>
        </section>
        <HeroArt />
      </div>
      <div className="about-columns">
        <section>
          <span className="about-icon">
            <Icon name="seed" size={28} />
          </span>
          <h2>What is Hamster?</h2>
          <p>
            Hamster Hour is a token project launched through IMD on Ethereum:
            the HAMSTER token and a Uniswap v4 hook for its HAMSTER/IMD pool,
            published with documentation and tests on GitHub. Visitors trade
            HAMSTER against IMD in that pool, and the hook’s fees fund the
            Hamster vault’s rewards and jackpot.
          </p>
          <p>
            Several unrelated projects use the Hamster name. Use the linked
            project sources to check you’re in the right place, and read
            Hamster Hour’s own rules before taking part.
          </p>
          <External href={HAMSTER_REPO}>
            Explore Hamster Hour’s source
          </External>
        </section>
        <section>
          <span className="about-icon">
            <Icon name="grid" size={28} />
          </span>
          <h2>What is IMD?</h2>
          <p>
            IMD connects AI contributors with work on websites, software, and
            on-chain projects. Its public explorer lets you follow the work and
            discover published results.
          </p>
          <p>
            Hamster Hub brings a few of those starting points together. Read the
            network’s own documentation for the details.
          </p>
          <External href="https://imd.fun/docs/">
            Read the IMD documentation
          </External>
        </section>
      </div>
      <section className="about-details">
        <h2>A few things to know.</h2>
        <details>
          <summary>Is Hamster Hub an official project?</summary>
          <p>
            Hamster Hub is an independent companion. It is not an official IMD
            or Hamster Hour interface. Resource listings help you explore and do
            not imply an affiliation or endorsement.
          </p>
        </details>
        <details>
          <summary>Where do dashboard numbers come from?</summary>
          <p>
            The Hamster Hour facts come from its published GitHub repository
            and IMD launch job, each linked beside its value and dated with the
            day it was checked. The resource count comes from this site’s
            directory. Your best score, completed rounds, collected acorns, and
            saved projects come from your activity in this browser. There are
            no live prices, balances, or blockchain statistics.
          </p>
        </details>
        <details>
          <summary>What does the site store?</summary>
          <p>
            Only your saved project IDs and Nut Dash results are stored in local
            storage. There is no account, analytics, shared leaderboard, or
            cross-device sync. Clearing your browser data clears your stash. If
            storage is blocked, you can still play and save links for the
            current visit.
          </p>
        </details>
        <details>
          <summary>Can I earn tokens by playing?</summary>
          <p>
            Nut Dash is a free browser game. Its acorns and points have no token
            or financial value. Nothing on this site asks you to connect a
            wallet or sign a transaction.
          </p>
        </details>
        <details>
          <summary>How are the resources selected?</summary>
          <p>
            Links come from IMD’s website, its public Awesome IMD directory, and
            Hamster Hour’s published source. Each directory card links to its
            source. Last reviewed {REVIEWED}; external projects can change after
            that date.
          </p>
        </details>
      </section>
    </div>
  );
}
export function App() {
  const [page, setPage] = useState<Page>(route);
  const [menuOpen, setMenuOpen] = useState(false);
  const [saved, setSaved] = useState(() =>
    loadSaved().filter((id) => PROJECTS.some((p) => p.id === id)),
  );
  const [stats, setStats] = useState<PersonalStats>(loadStats);
  const [storageError, setStorageError] = useState(false);
  const [notice, setNotice] = useState("");
  const main = useRef<HTMLElement>(null);
  const first = useRef(true);
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const changed = () => {
      setPage(route());
      setMenuOpen(false);
    };
    window.addEventListener("hashchange", changed);
    return () => window.removeEventListener("hashchange", changed);
  }, []);
  useEffect(() => {
    document.title =
      page === "home"
        ? "Hamster Hub · Catch acorns. Find Hamster."
        : `${NAV.find((item) => item.id === page)?.label} · Hamster Hub`;
    if (first.current) {
      first.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
    main.current?.focus({ preventScroll: true });
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [menuOpen]);
  function toggle(id: string) {
    const exists = saved.includes(id);
    const next = exists ? saved.filter((item) => item !== id) : [...saved, id];
    setSaved(next);
    if (!persist("saved", next)) setStorageError(true);
    setNotice(
      `${PROJECTS.find((p) => p.id === id)?.name} ${exists ? "removed from" : "added to"} saved projects.`,
    );
  }
  function complete(score: number, nuts: number) {
    const next = {
      best: Math.max(stats.best, score),
      rounds: stats.rounds + 1,
      nuts: stats.nuts + nuts,
      recent: [score, ...stats.recent].slice(0, 5),
    };
    setStats(next);
    if (!persist("stats", next)) setStorageError(true);
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner content-width">
          <a className="brand" href="#/home" aria-label="Hamster Hub home">
            <img src="./art/hamster.svg" alt="" width="44" height="44" />
            <span>
              Hamster Hub<span className="brand-dot">.</span>
            </span>
          </a>
          <button
            type="button"
            ref={menuButton}
            className="menu-toggle icon-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="primary-nav"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          >
            <Icon name={menuOpen ? "close" : "menu"} size={24} />
          </button>
          <nav
            id="primary-nav"
            aria-label="Main navigation"
            className={menuOpen ? "nav-open" : ""}
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#/${item.id}`}
                className={page === item.id ? "nav-active" : ""}
                aria-current={page === item.id ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a className="header-burrow" href="#/dashboard">
            <Icon name="heart" size={18} />
            <span>My burrow</span>
            <span className="burrow-count">{saved.length}</span>
          </a>
        </div>
      </header>
      <main ref={main} id="main" tabIndex={-1}>
        {storageError && (
          <div className="storage-notice content-width" role="status">
            <Icon name="info" />
            <p>
              Browser storage is unavailable. Your stash lasts for this visit
              only.
            </p>
            <button
              className="icon-button"
              type="button"
              aria-label="Dismiss storage notice"
              onClick={() => setStorageError(false)}
            >
              <Icon name="close" />
            </button>
          </div>
        )}
        {page === "home" && (
          <Home saved={saved} toggle={toggle} stats={stats} />
        )}
        {page === "directory" && <Directory saved={saved} toggle={toggle} />}
        {page === "dashboard" && (
          <Dashboard saved={saved} stats={stats} toggle={toggle} />
        )}
        {page === "arcade" && <Arcade stats={stats} complete={complete} />}
        {page === "about" && <About />}
      </main>
      <footer className="site-footer">
        <div className="footer-top content-width">
          <a className="brand" href="#/home">
            <img src="./art/hamster.svg" alt="" width="36" height="36" />
            <span>
              Hamster Hub<span className="brand-dot">.</span>
            </span>
          </a>
          <p>A cozy corner of a bigger ecosystem.</p>
          <div>
            <a href="#/about">About</a>
            <External href="https://imd.fun/">Visit IMD</External>
            <External href="https://github.com/Identity-md/awesome-imd">
              More resources
            </External>
          </div>
        </div>
        <div className="footer-bottom content-width">
          <span>Made for curious hamsters.</span>
          <span>Independent companion · Local play · Open exploration</span>
          <img src="./art/acorn.svg" alt="" width="20" height="20" />
        </div>
      </footer>
      <div className="sr-only" role="status">
        {notice}
      </div>
    </>
  );
}
