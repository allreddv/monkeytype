import { z } from "zod";
import { LocalStorageWithSchema } from "../utils/local-storage-with-schema";
import Config from "../config";
import * as TestWords from "./test-words";

const threeStrikesStreaks = new LocalStorageWithSchema({
  key: "threeStrikesStreaks",
  schema: z.record(
    z.string(),
    z.object({
      current: z.number(),
      best: z.number(),
    }),
  ),
  fallback: {},
});

type ThreeStrikesStreak = {
  current: number;
  best: number;
};

export function getConfigKey(): string {
  const mode = Config.mode;
  let mode2 = "";
  if (mode === "time") mode2 = String(Config.time);
  if (mode === "words") mode2 = String(Config.words);
  if (mode === "quote") mode2 = String(TestWords.currentQuote?.group ?? "");
  return `${mode}-${mode2}-${Config.language}-${Config.punctuation}-${Config.numbers}-${Config.difficulty}`;
}

export function getStreak(): ThreeStrikesStreak {
  const key = getConfigKey();
  const data = threeStrikesStreaks.get();
  return data[key] ?? { current: 0, best: 0 };
}

export function incrementStreak(): void {
  const key = getConfigKey();
  const data = threeStrikesStreaks.get();
  const streak = data[key] ?? { current: 0, best: 0 };
  streak.current += 1;
  if (streak.current > streak.best) {
    streak.best = streak.current;
  }
  data[key] = streak;
  threeStrikesStreaks.set(data);
}

export function resetCurrentStreak(): void {
  const key = getConfigKey();
  const data = threeStrikesStreaks.get();
  const streak = data[key] ?? { current: 0, best: 0 };
  streak.current = 0;
  data[key] = streak;
  threeStrikesStreaks.set(data);
}
