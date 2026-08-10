import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { WerewolfSettings } from "./types";
import { assignRoles, type PlayerRole } from "./gameLogic";

const PlayingWerewolf = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const settings = location.state as WerewolfSettings | null;

  const [roleAssignments, setRoleAssignments] = useState<PlayerRole[]>(() =>
    settings ? assignRoles(settings) : [],
  );
  const [activeId, setActiveId] = useState<number | null>(null);
  const [viewedIds, setViewedIds] = useState<Set<number>>(new Set());
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  useEffect(() => {
    // Se si arriva qui senza passare dal setup (refresh, link diretto, back
    // button), non abbiamo impostazioni valide: si torna indietro.
    if (!settings) {
      navigate("/werewolf", { replace: true });
    }
  }, [settings, navigate]);

  if (!settings) {
    return null;
  }

  const activePlayer = roleAssignments.find((p) => p.id === activeId) ?? null;

  const closeReveal = () => {
    if (activeId !== null) {
      setViewedIds((current) => new Set(current).add(activeId));
    }
    setActiveId(null);
  };

  const confirmRestart = () => {
    setRoleAssignments(assignRoles(settings));
    setViewedIds(new Set());
    setActiveId(null);
    setShowRestartConfirm(false);
  };

  return (
    <div
      className="min-h-screen bg-ink flex flex-col items-center px-5 pb-10"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      <header className="relative flex flex-col items-center text-center gap-2 mb-8 w-full max-w-md">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="absolute left-0 top-1 font-body text-sm text-muted hover:text-cream transition"
        >
          ← Home
        </button>
        <h1 className="font-display font-extrabold text-3xl text-cream">
          Passa il telefono
        </h1>
        <p className="font-body text-muted text-sm max-w-xs">
          Ogni giocatore tocca la propria card, guarda da solo il ruolo e la
          richiude prima di passare il telefono al prossimo.
        </p>
      </header>

      <main className="w-full max-w-md grid grid-cols-2 gap-4">
        {roleAssignments.map((player) => {
          const isViewed = viewedIds.has(player.id);
          return (
            <button
              key={player.id}
              type="button"
              onClick={() => setActiveId(player.id)}
              className={[
                "rounded-2xl py-6 flex flex-col items-center gap-1 transition active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                isViewed
                  ? "bg-surface/40 border-2 border-dashed border-white/10 opacity-50"
                  : "bg-surface border border-white/5 shadow-lg shadow-black/30",
              ].join(" ")}
            >
              <span className="font-display font-bold text-lg text-cream">
                Giocatore {player.id}
              </span>
              <span className="font-body text-xs text-muted">
                {isViewed ? "Visto ✓" : "Tocca per vedere"}
              </span>
            </button>
          );
        })}
      </main>

      <p className="font-body text-xs text-muted mt-6">
        {viewedIds.size} di {roleAssignments.length} hanno visto il proprio ruolo
      </p>

      <button
        type="button"
        onClick={() => setShowRestartConfirm(true)}
        className="mt-6 font-body text-sm text-muted hover:text-hot transition underline underline-offset-4"
      >
        Ricomincia
      </button>

      {/* Popup di conferma restart */}
      {showRestartConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-6 z-50">
          <div className="bg-surface rounded-3xl p-6 max-w-xs w-full shadow-xl shadow-black/40 flex flex-col items-center text-center gap-4">
            <h2 className="font-display font-bold text-xl text-cream">
              Ricominciare?
            </h2>
            <p className="font-body text-muted text-sm">
              I ruoli verranno rimescolati per tutti. Chi ha già visto il
              proprio ruolo dovrà rivederlo.
            </p>
            <div className="flex gap-3 w-full mt-2">
              <button
                type="button"
                onClick={() => setShowRestartConfirm(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-cream font-body font-semibold py-3 rounded-xl transition active:scale-95"
              >
                Annulla
              </button>
              <button
                type="button"
                onClick={confirmRestart}
                className="flex-1 bg-hot hover:bg-hot/90 text-ink font-display font-bold py-3 rounded-xl transition active:scale-95"
              >
                Ricomincia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay di rivelazione: full screen, si chiude solo con azione esplicita */}
      {activePlayer && (
        <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center gap-6 px-6 z-50">
          <span className="font-body text-muted text-sm">
            Giocatore {activePlayer.id} — non far vedere lo schermo agli altri
          </span>

          <div className="flex flex-col items-center gap-3 text-center max-w-sm">
            <span className="font-display font-extrabold text-3xl text-hot">
              {activePlayer.roleName}
            </span>
            {activePlayer.description && (
              <p className="font-body text-cream text-base">{activePlayer.description}</p>
            )}
          </div>

          <button
            type="button"
            onClick={closeReveal}
            className="w-full max-w-xs mt-4 bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
          >
            Ho visto, nascondi
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayingWerewolf;