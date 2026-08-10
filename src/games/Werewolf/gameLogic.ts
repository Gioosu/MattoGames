import type { WerewolfSettings } from "./types";

export interface PlayerRole {
  id: number; // 1-indexed, mostrato come "Giocatore N"
  roleName: string;
  description: string;
}

// Fisher-Yates, per assegnare i ruoli senza pattern prevedibili
const shuffledIndexes = (length: number): number[] => {
  const indexes = Array.from({ length }, (_, i) => i);
  for (let i = indexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexes[i], indexes[j]] = [indexes[j], indexes[i]];
  }
  return indexes;
};

export const assignRoles = (settings: WerewolfSettings): PlayerRole[] => {
  // Il dizionario { "Lupo": {count: 2, ...}, "Contadino": {count: 5, ...} }
  // diventa una lista piatta di "posti", uno per ogni giocatore che avrà
  // quel ruolo: [Lupo, Lupo, Contadino, Contadino, Contadino, Contadino, Contadino]
  const slots: { roleName: string; description: string }[] = [];
  Object.entries(settings.roles).forEach(([roleName, { count, description }]) => {
    for (let i = 0; i < count; i++) {
      slots.push({ roleName, description });
    }
  });

  const order = shuffledIndexes(slots.length);
  return order.map((slotIndex, i) => ({
    id: i + 1,
    roleName: slots[slotIndex].roleName,
    description: slots[slotIndex].description,
  }));
};