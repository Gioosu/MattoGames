// Un ruolo mentre è in fase di editing nella schermata di setup: sia i
// ruoli base (Lupo, Guardia, Veggente) sia quelli custom aggiunti dal
// giocatore condividono questa stessa forma.
export interface RoleConfig {
  id: string;
  name: string;
  description: string;
  count: number;
  isCustom: boolean;
}

// Un singolo ruolo dentro il dizionario finale, dopo aver premuto "Iniziamo!"
export interface RoleAssignment {
  count: number;
  description: string;
}

export interface WerewolfSettings {
  players: number;
  // "Lupo": { count: 2, description: "..." }, "Contadino": { count: 5, description: "..." }, ...
  roles: Record<string, RoleAssignment>;
}