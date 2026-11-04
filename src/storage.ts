export interface PersonalStats {
  best: number;
  rounds: number;
  nuts: number;
  recent: number[];
}
export const EMPTY_STATS: PersonalStats = {
  best: 0,
  rounds: 0,
  nuts: 0,
  recent: [],
};
export function loadSaved(): string[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("hamster-hub:saved") ?? "[]",
    );
    return Array.isArray(value)
      ? [...new Set(value.filter((v): v is string => typeof v === "string"))]
      : [];
  } catch {
    return [];
  }
}
export function loadStats(): PersonalStats {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("hamster-hub:stats") ?? "null",
    );
    if (!value || typeof value !== "object") return { ...EMPTY_STATS };
    const v = value as Record<string, unknown>;
    const safe = (x: unknown) =>
      typeof x === "number" && Number.isSafeInteger(x) && x >= 0 ? x : 0;
    return {
      best: safe(v.best),
      rounds: safe(v.rounds),
      nuts: safe(v.nuts),
      recent: Array.isArray(v.recent) ? v.recent.map(safe).slice(0, 5) : [],
    };
  } catch {
    return { ...EMPTY_STATS };
  }
}
export function persist(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(`hamster-hub:${key}`, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
