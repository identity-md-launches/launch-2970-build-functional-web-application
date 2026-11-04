import test from "node:test";
import assert from "node:assert/strict";
import {
  advance,
  initialGame,
  movePlayer,
  ROUND_SECONDS,
} from "../src/game/engine.ts";
const playing = (patch = {}) => ({
  ...initialGame(),
  status: "playing",
  ...patch,
});

test("ready, paused and finished rounds never advance", () => {
  for (const status of ["ready", "paused", "over"]) {
    const state = { ...initialGame(), status };
    assert.equal(advance(state, 1), state);
  }
});
test("movement respects the three lanes and requires active play", () => {
  assert.equal(movePlayer(playing({ lane: 0 }), -1).lane, 0);
  assert.equal(movePlayer(playing({ lane: 2 }), 1).lane, 2);
  assert.equal(movePlayer(playing(), -1).lane, 0);
  assert.equal(movePlayer(initialGame(), 1).lane, 1);
});
test("catching an acorn scores once and removes the drop", () => {
  const state = playing({
    drops: [{ id: 0, lane: 1, y: 0.99, kind: "acorn" }],
    spawnIn: 5,
  });
  const caught = advance(state, 0.1);
  assert.equal(caught.score, 10);
  assert.equal(caught.nuts, 1);
  assert.equal(caught.drops.length, 0);
  assert.equal(advance(caught, 0.1).score, 10);
  assert.equal(state.score, 0, "simulation must not mutate its input");
});
test("a missed acorn awards no points, including after the catch line", () => {
  const state = playing({
    drops: [{ id: 0, lane: 0, y: 0.99, kind: "acorn" }],
    spawnIn: 5,
  });
  const missed = advance(state, 0.1);
  assert.equal(missed.score, 0);
  assert.equal(advance({ ...missed, lane: 0 }, 0.1).score, 0);
});
test("a rock costs one heart and zero hearts end the round", () => {
  const state = playing({
    lives: 1,
    drops: [{ id: 0, lane: 1, y: 0.99, kind: "rock" }],
    spawnIn: 5,
  });
  const hit = advance(state, 0.1);
  assert.equal(hit.lives, 0);
  assert.equal(hit.status, "over");
  assert.equal(hit.score, 0);
  assert.equal(advance(hit, 1), hit);
});
test("the round ends at exactly 30 seconds", () => {
  const ended = advance(playing({ elapsed: 29.9, spawnIn: 10 }), 0.5);
  assert.equal(ended.elapsed, ROUND_SECONDS);
  assert.equal(ended.status, "over");
});
test("seeded spawning produces lanes and both item types", () => {
  const values = [0, 0.1, 0.99, 0.9];
  let cursor = 0;
  const random = () => values[cursor++ % values.length];
  const state = advance(playing({ spawnIn: 0.01 }), 1, random);
  assert.equal(state.drops.length, 2);
  assert.deepEqual(
    state.drops.map((d) => [d.lane, d.kind]),
    [
      [0, "rock"],
      [2, "acorn"],
    ],
  );
});
test("invalid elapsed deltas do not corrupt a round", () => {
  const state = playing();
  for (const delta of [-1, 0, NaN, Infinity])
    assert.equal(advance(state, delta), state);
});
