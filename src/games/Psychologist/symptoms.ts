import rawCsv from "./symptoms.csv?raw";

const parseSymptoms = (csv: string): string[] =>
  csv
    .trim()
    .split("\n")
    .slice(1) // salta l'intestazione "symptom"
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

export const symptomBank: string[] = parseSymptoms(rawCsv);

if (import.meta.env.DEV) {
  const seen = new Set<string>();
  symptomBank.forEach((symptom, i) => {
    const key = symptom.trim().toLowerCase();
    if (seen.has(key)) {
      console.warn(`[symptoms.csv] sintomo duplicato alla riga ${i + 2}: "${symptom}"`);
    }
    seen.add(key);
  });
}

export const pickRandomSymptom = (): string =>
  symptomBank[Math.floor(Math.random() * symptomBank.length)];