import { useCallback, useEffect, useRef, useState } from "react";
import {
  advance,
  initialGame,
  movePlayer,
  ROUND_SECONDS,
} from "../game/engine";
import type { GameState } from "../game/engine";
import { Icon } from "./Icon";

export function Game({
  best,
  onComplete,
}: {
  best: number;
  onComplete: (score: number, nuts: number) => void;
}) {
  const [game, setGame] = useState<GameState>(initialGame);
  const state = useRef(game);
  const board = useRef<HTMLDivElement>(null);
  const start = useRef<HTMLButtonElement>(null);
  const completed = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const update = useCallback((next: GameState) => {
    state.current = next;
    setGame(next);
  }, []);
  const move = useCallback(
    (direction: number) => update(movePlayer(state.current, direction)),
    [update],
  );
  const togglePause = useCallback(() => {
    const current = state.current;
    if (current.status === "playing" || current.status === "paused")
      update({
        ...current,
        status: current.status === "playing" ? "paused" : "playing",
      });
  }, [update]);
  function begin() {
    completed.current = false;
    update({ ...initialGame(), status: "playing" });
    board.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    if (game.status !== "playing") return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      // Hidden documents pause separately. Cap a slow visible frame to avoid collision tunneling.
      const delta = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      const next = advance(state.current, delta);
      update(next);
      if (next.status === "over") {
        if (!completed.current) {
          completed.current = true;
          onCompleteRef.current(next.score, next.nuts);
        }
      } else if (next.status === "playing") frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [game.status, update]);
  useEffect(() => {
    if (game.status === "over") start.current?.focus({ preventScroll: true });
  }, [game.status]);
  useEffect(() => {
    const hidden = () => {
      if (document.hidden && state.current.status === "playing")
        update({ ...state.current, status: "paused" });
    };
    document.addEventListener("visibilitychange", hidden);
    const key = (e: KeyboardEvent) => {
      const target = e.target;
      if (
        target instanceof HTMLElement &&
        /INPUT|SELECT|TEXTAREA/.test(target.tagName)
      )
        return;
      if (
        !board.current?.contains(target as Node) &&
        !board.current?.parentElement?.contains(target as Node)
      )
        return;
      if (
        ["ArrowLeft", "ArrowRight", "a", "A", "d", "D"].includes(e.key) &&
        state.current.status === "playing"
      ) {
        e.preventDefault();
        move(e.key === "ArrowLeft" || e.key.toLowerCase() === "a" ? -1 : 1);
      }
      if ((e.key.toLowerCase() === "p" || e.key === "Escape") && !e.repeat) {
        e.preventDefault();
        togglePause();
      }
    };
    window.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      window.removeEventListener("keydown", key);
    };
  }, [move, togglePause, update]);
  const active = game.status === "playing" || game.status === "paused";
  return (
    <div className="game-shell">
      <div className="game-toolbar">
        <div className="game-score">
          <img src="./art/acorn.svg" alt="" width="28" height="28" />
          <span>
            Score <strong data-testid="score">{game.score}</strong>
          </span>
        </div>
        <span className="game-time">
          <Icon name="clock" />
          <span>{Math.ceil(ROUND_SECONDS - game.elapsed)}s</span>
        </span>
        <div
          className="game-lives"
          aria-label={`${game.lives} of 3 hearts remaining`}
        >
          <span className="sr-only">Hearts: {game.lives}</span>
          {[0, 1, 2].map((n) => (
            <Icon
              key={n}
              name="heart"
              className={n < game.lives ? "heart-full" : "heart-empty"}
              size={20}
            />
          ))}
        </div>
        {active && (
          <button
            type="button"
            className="icon-button game-pause"
            onClick={togglePause}
            aria-label={game.status === "paused" ? "Resume game" : "Pause game"}
          >
            <Icon name={game.status === "paused" ? "play" : "pause"} />
          </button>
        )}
      </div>
      <div
        className="playfield"
        ref={board}
        tabIndex={0}
        role="group"
        aria-label="Nut Dash playfield"
        aria-describedby="game-directions"
        data-lane={game.lane}
        data-state={game.status}
      >
        <img
          src="./art/valley.svg"
          alt=""
          className="game-landscape"
          draggable="false"
        />
        <div className="lane-lines" aria-hidden="true">
          <span />
          <span />
        </div>
        <div className="falling-area" aria-hidden="true">
          {game.drops.map((drop) => (
            <img
              key={drop.id}
              data-kind={drop.kind}
              src={`./art/${drop.kind}.svg`}
              alt=""
              className="drop pixel"
              style={{
                left: `${18 + drop.lane * 32}%`,
                top: `${drop.y * 100}%`,
              }}
            />
          ))}
        </div>
        <img
          src="./art/hamster.svg"
          alt=""
          className="player pixel"
          style={{ left: `${18 + game.lane * 32}%` }}
          draggable="false"
        />
        {game.status !== "playing" && (
          <div className="game-overlay">
            <div className="game-message">
              <h2>
                {game.status === "ready"
                  ? "Nut Dash"
                  : game.status === "paused"
                    ? "Snack break?"
                    : game.lives === 0
                      ? "Out of hearts!"
                      : "A lovely little haul."}
              </h2>
              <p>
                {game.status === "ready"
                  ? "Catch acorns. Dodge rocks. Fill your stash."
                  : game.status === "paused"
                    ? "Your acorns can wait. Pick up where you left off."
                    : `${game.score} points · ${game.nuts} ${game.nuts === 1 ? "acorn" : "acorns"} collected`}
              </p>
              <button
                ref={start}
                type="button"
                className="button primary"
                onClick={
                  game.status === "paused"
                    ? () => {
                        togglePause();
                        board.current?.focus({ preventScroll: true });
                      }
                    : begin
                }
              >
                <Icon name={game.status === "over" ? "restart" : "play"} />
                {game.status === "ready"
                  ? "Start game"
                  : game.status === "paused"
                    ? "Keep playing"
                    : "Play again"}
              </button>
              {game.status === "ready" && (
                <span className="game-overlay-note">30 seconds · 3 hearts</span>
              )}
              {game.status === "over" && (
                <span className="game-overlay-note">
                  Best in this browser: {Math.max(best, game.score)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="game-controls">
        <button
          type="button"
          className="move-button"
          onClick={() => move(-1)}
          disabled={game.status !== "playing"}
          aria-label="Move left"
        >
          <Icon name="left" size={24} />
          <span>Left</span>
        </button>
        <p id="game-directions">
          Use <kbd>←</kbd> <kbd>→</kbd> or the buttons to move.
          <br />
          <span>
            Press <kbd>P</kbd> to pause.
          </span>
        </p>
        <button
          type="button"
          className="move-button"
          onClick={() => move(1)}
          disabled={game.status !== "playing"}
          aria-label="Move right"
        >
          <span>Right</span>
          <Icon name="right" size={24} />
        </button>
      </div>
      <div className="sr-only" role="status">
        {game.status === "over"
          ? `Round finished. ${game.score} points. ${game.nuts} acorns collected.`
          : game.status === "paused"
            ? "Game paused."
            : game.status === "playing"
              ? "Game started. Use left and right arrows to catch acorns and avoid rocks."
              : ""}
      </div>
    </div>
  );
}
