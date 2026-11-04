export type GameStatus = "ready" | "playing" | "paused" | "over";
export interface Drop {
  id: number;
  lane: number;
  y: number;
  kind: "acorn" | "rock";
}
export interface GameState {
  status: GameStatus;
  lane: number;
  score: number;
  nuts: number;
  lives: number;
  elapsed: number;
  spawnIn: number;
  nextId: number;
  drops: Drop[];
}
export const ROUND_SECONDS = 30;
export function initialGame(): GameState {
  return {
    status: "ready",
    lane: 1,
    score: 0,
    nuts: 0,
    lives: 3,
    elapsed: 0,
    spawnIn: 0.4,
    nextId: 0,
    drops: [],
  };
}
export function movePlayer(game: GameState, direction: number): GameState {
  return game.status === "playing"
    ? { ...game, lane: Math.max(0, Math.min(2, game.lane + direction)) }
    : game;
}
/** Pure simulation. Normalized y=1 is the catch line. Time advances only while playing. */
export function advance(
  game: GameState,
  dt: number,
  random: () => number = Math.random,
): GameState {
  if (game.status !== "playing" || !Number.isFinite(dt) || dt <= 0) return game;
  const step = Math.min(dt, ROUND_SECONDS - game.elapsed);
  let { score, nuts, lives, spawnIn, nextId } = game;
  const elapsed = Math.min(ROUND_SECONDS, game.elapsed + step);
  const speed = 0.47 + elapsed * 0.004;
  const drops: Drop[] = [];
  for (const item of game.drops) {
    const nextY = item.y + step * speed;
    if (item.y < 1 && nextY >= 1 && item.lane === game.lane) {
      if (item.kind === "acorn") {
        score += 10;
        nuts++;
      } else lives = Math.max(0, lives - 1);
    } else if (nextY < 1.1) drops.push({ ...item, y: nextY });
  }
  spawnIn -= step;
  while (spawnIn <= 0 && lives > 0 && elapsed < ROUND_SECONDS) {
    drops.push({
      id: nextId++,
      lane: Math.min(2, Math.floor(random() * 3)),
      y: -0.05,
      kind: random() < 0.24 ? "rock" : "acorn",
    });
    spawnIn += Math.max(0.36, 0.7 - elapsed * 0.009);
  }
  return {
    ...game,
    score,
    nuts,
    lives,
    elapsed,
    spawnIn,
    nextId,
    drops,
    status: lives === 0 || elapsed >= ROUND_SECONDS ? "over" : "playing",
  };
}
