import rawCsv from "./words.csv?raw";

export interface WordEntry {
  word: string;
  clue: string;
}

// Parser volutamente semplice: due colonne, nessuna virgola dentro ai
// valori. Se un domani un indizio dovesse contenere una virgola (es.
// "Cane, gatto"), questo va sostituito con una libreria vera (papaparse),
// perché uno split ingenuo lo spezzerebbe a metà.
const parseWordBank = (csv: string): WordEntry[] =>
  csv
    .trim()
    .split("\n")
    .slice(1) // salta l'intestazione "word,clue"
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [word, clue] = line.split(",").map((value) => value.trim());
      return { word, clue };
    });

// L'impostore vede solo "clue" (se withClue è attivo), gli altri vedono "word".
// Le clue sono associative (qualcosa di collegato alla parola), non la
// categoria della parola: es. "Halloween" -> "Zucca", non "Una festività".
export const wordBank: WordEntry[] = parseWordBank(rawCsv);

export const pickRandomWord = (): WordEntry =>
  wordBank[Math.floor(Math.random() * wordBank.length)];