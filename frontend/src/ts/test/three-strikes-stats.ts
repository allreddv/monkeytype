import { z } from "zod";
import { LocalStorageWithSchema } from "../utils/local-storage-with-schema";
import Config from "../config";
import * as TestWords from "./test-words";

const threeStrikesCompletions = new LocalStorageWithSchema({
  key: "threeStrikesCompletions",
  schema: z.record(z.string(), z.number()),
  fallback: {},
});

export function getConfigKey(): string {
  const mode = Config.mode;
  let mode2 = "";
  if (mode === "time") mode2 = String(Config.time);
  if (mode === "words") mode2 = String(Config.words);
  if (mode === "quote") mode2 = String(TestWords.currentQuote?.group ?? "");
  return `${mode}-${mode2}-${Config.language}-${Config.punctuation}-${Config.numbers}-${Config.difficulty}`;
}

export function getCompletions(): number {
  const key = getConfigKey();
  const data = threeStrikesCompletions.get();
  return data[key] ?? 0;
}

export function incrementCompletions(): void {
  const key = getConfigKey();
  const data = threeStrikesCompletions.get();
  data[key] = (data[key] ?? 0) + 1;
  threeStrikesCompletions.set(data);
}
