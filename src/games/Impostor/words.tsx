export interface WordEntry {
  word: string;
  clue: string;
}

// L'impostore vede solo "clue" (se withClue è attivo), gli altri vedono "word".
// Le clue sono associative (qualcosa di collegato alla parola), non la
// categoria della parola: es. "Halloween" -> "Zucca", non "Una festività".
export const wordBank: WordEntry[] = [
  { word: "Spiaggia", clue: "Sabbia" },
  { word: "Pizza", clue: "Napoli" },
  { word: "Batman", clue: "Pipistrello" },
  { word: "Chitarra", clue: "Corde" },
  { word: "Roma", clue: "Colosseo" },
  { word: "Dentista", clue: "Carie" },
  { word: "Netflix", clue: "Divano" },
  { word: "Pallone", clue: "Rete" },
  { word: "Matrimonio", clue: "Anello" },
  { word: "Zaino", clue: "Scuola" },
  { word: "Vulcano", clue: "Lava" },
  { word: "Aeroporto", clue: "Valigia" },
  { word: "Sushi", clue: "Oriente" },
  { word: "Bicicletta", clue: "Pedali" },
  { word: "Halloween", clue: "Zucca" },
];

export const pickRandomWord = (): WordEntry =>
  wordBank[Math.floor(Math.random() * wordBank.length)];