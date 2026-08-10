import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { RoleConfig, RoleAssignment, WerewolfSettings } from "./types";

const MIN_PLAYERS = 6;
const MAX_PLAYERS = 20;

const VILLAGER_NAME = "Contadino";
const VILLAGER_DESCRIPTION =
  "Nessun potere speciale: il tuo voto durante il giorno è la sola arma.";

const DEFAULT_ROLES: RoleConfig[] = [
  {
    id: "wolf",
    name: "Lupo",
    description: "Ogni notte, i lupi scelgono insieme una vittima da eliminare.",
    count: 2,
    isCustom: false,
  },
  {
    id: "guard",
    name: "Guardia",
    description: "Ogni notte protegge un giocatore a scelta dall'attacco dei lupi.",
    count: 1,
    isCustom: false,
  },
  {
    id: "seer",
    name: "Veggente",
    description: "Ogni notte scopre in segreto il vero ruolo di un altro giocatore.",
    count: 1,
    isCustom: false,
  },
];

const makeCustomRoleId = () => `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// Contatore +/- riusabile, pensato per essere premuto col pollice
interface StepperProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

const Stepper = ({ label, value, min, max, onChange }: StepperProps) => {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={decrease}
        disabled={value <= min}
        aria-label={`Diminuisci ${label.toLowerCase()}`}
        className="w-9 h-9 rounded-full bg-white/5 text-cream text-lg font-display font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:active:scale-100"
      >
        −
      </button>
      <span className="font-display font-extrabold text-xl text-glow w-6 text-center tabular-nums">
        {value}
      </span>
      <button
        type="button"
        onClick={increase}
        disabled={value >= max}
        aria-label={`Aumenta ${label.toLowerCase()}`}
        className="w-9 h-9 rounded-full bg-white/5 text-cream text-lg font-display font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:active:scale-100"
      >
        +
      </button>
    </div>
  );
};

const StartingWerewolf = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(8);
  const [roles, setRoles] = useState<RoleConfig[]>(DEFAULT_ROLES);

  const specialCount = roles.reduce((sum, r) => sum + r.count, 0);
  const villagerCount = Math.max(0, players - specialCount);

  const wolfRole = roles.find((r) => r.id === "wolf");
  const customRolesHaveNames = roles
    .filter((r) => r.isCustom)
    .every((r) => r.name.trim().length > 0);

  const isValid =
    players >= MIN_PLAYERS &&
    Boolean(wolfRole && wolfRole.count >= 1) &&
    specialCount <= players - 1 &&
    customRolesHaveNames;

  const updateRole = (id: string, patch: Partial<RoleConfig>) => {
    setRoles((current) => current.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRole = (id: string) => {
    setRoles((current) => current.filter((r) => r.id !== id));
  };

  const addCustomRole = () => {
    setRoles((current) => [
      ...current,
      { id: makeCustomRoleId(), name: "", description: "", count: 1, isCustom: true },
    ]);
  };

  const handleStart = () => {
    const rolesDict: Record<string, RoleAssignment> = {};
    roles.forEach((r) => {
      if (r.count > 0) {
        rolesDict[r.name.trim()] = { count: r.count, description: r.description.trim() };
      }
    });
    rolesDict[VILLAGER_NAME] = { count: villagerCount, description: VILLAGER_DESCRIPTION };

    const settings: WerewolfSettings = { players, roles: rolesDict };
    navigate("/werewolf/play", { state: settings });
  };

  return (
    <div
      className="min-h-screen bg-ink flex flex-col items-center px-5"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="relative flex flex-col items-center text-center gap-2 mb-6 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-0 top-1 font-body text-sm text-muted hover:text-cream transition"
        >
          ← Home
        </button>
        <h1 className="font-display font-extrabold text-4xl text-cream">
          Were<span className="text-hot">wolf</span>
        </h1>
        <p className="font-body text-muted text-base max-w-xs">
          Uno o più assassini dovranno fare una strage, riuscirete a fermarli in
          tempo?
        </p>
      </header>

      <main className="w-full max-w-md bg-surface rounded-3xl p-5 shadow-xl shadow-black/30 flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4">
          <span className="font-body text-cream text-base">Giocatori</span>
          <Stepper
            label="Giocatori"
            value={players}
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            onChange={setPlayers}
          />
        </div>

        <div className="h-px bg-white/5" />

        {/* Ruoli speciali: base + custom, stessa forma per entrambi */}
        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <div key={role.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                {role.isCustom ? (
                  <input
                    type="text"
                    value={role.name}
                    onChange={(e) => updateRole(role.id, { name: e.target.value })}
                    placeholder="Nome ruolo"
                    className="font-body text-cream text-base bg-white/5 rounded-lg px-3 py-1.5 flex-1 min-w-0 placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-glow"
                  />
                ) : (
                  <span className="font-body text-cream text-base">{role.name}</span>
                )}

                <Stepper
                  label={role.name || "ruolo"}
                  value={role.count}
                  min={role.isCustom ? 0 : role.id === "wolf" ? 1 : 0}
                  max={Math.max(1, players - 1)}
                  onChange={(next) => updateRole(role.id, { count: next })}
                />

                {role.isCustom && (
                  <button
                    type="button"
                    onClick={() => removeRole(role.id)}
                    aria-label={`Rimuovi ${role.name || "ruolo"}`}
                    className="w-8 h-8 rounded-full bg-white/5 hover:bg-hot/20 text-muted hover:text-hot transition flex items-center justify-center shrink-0"
                  >
                    ×
                  </button>
                )}
              </div>

              {role.isCustom ? (
                <input
                  type="text"
                  value={role.description}
                  onChange={(e) => updateRole(role.id, { description: e.target.value })}
                  placeholder="Descrizione (opzionale)"
                  className="font-body text-muted text-sm bg-white/5 rounded-lg px-3 py-1.5 placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-glow"
                />
              ) : (
                <p className="font-body text-muted text-xs">{role.description}</p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addCustomRole}
            className="font-body text-sm text-glow hover:text-glow/80 transition text-left"
          >
            + Aggiungi ruolo
          </button>
        </div>

        <div className="h-px bg-white/5" />

        <div className="flex items-center justify-between">
          <span className="font-body text-cream text-base">{VILLAGER_NAME}</span>
          <span className="font-display font-extrabold text-xl text-muted tabular-nums">
            {villagerCount}
          </span>
        </div>
        <p className="font-body text-muted text-xs -mt-3">
          Calcolato in automatico: giocatori meno tutti i ruoli speciali sopra.
        </p>
      </main>

      {!isValid && (
        <p className="font-body text-xs text-muted mt-4 text-center max-w-sm">
          Servono almeno {MIN_PLAYERS} giocatori, almeno un Lupo, i ruoli
          speciali non possono superare i giocatori disponibili, e ogni ruolo
          personalizzato ha bisogno di un nome.
        </p>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          disabled={!isValid}
          onClick={handleStart}
          className="px-8 py-4 rounded-2xl bg-hot text-ink font-display font-extrabold shadow-xl shadow-hot/20 hover:bg-hot/90 disabled:bg-white/10 disabled:text-muted disabled:cursor-not-allowed transition active:scale-95"
        >
          Iniziamo!
        </button>
      </div>
    </div>
  );
};

export default StartingWerewolf;