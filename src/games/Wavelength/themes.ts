import rawCsv from "./themes.csv?raw";

export interface Theme {
  topic: string;
  poleLeft: string;
  poleRight: string;
}

const parseThemes = (csv: string): Theme[] =>
  csv
    .trim()
    .split("\n")
    .slice(1) // salta l'intestazione "theme,poleLeft,poleRight"
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [topic, poleLeft, poleRight] = line.split(",").map((value) => value.trim());
      return { topic, poleLeft, poleRight };
    });

export const themeBank: Theme[] = parseThemes(rawCsv);

if (import.meta.env.DEV) {
  const seen = new Set<string>();
  themeBank.forEach((t, i) => {
    const key = t.topic.trim().toLowerCase();
    if (seen.has(key)) {
      console.warn(`[themes.csv] tema duplicato alla riga ${i + 2}: "${t.topic}"`);
    }
    seen.add(key);
  });
}

export const pickRandomTheme = (): Theme =>
  themeBank[Math.floor(Math.random() * themeBank.length)];
