import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "./assets/mg_nobg_white.webp";

const taglines: string[] = [
  "Siete pronti a litigare brutalmente?",
  "+MattoGames, -Amici.",
  "Stasera qualcuno si arrabbia. Forse tu. Forse è Jack.",
  "Niente scuse, si gioca finché non urlate.",
  "Chi perde offre il prossimo giro.",
  "Amicizie a rischio da qui in poi.",
  "Regola numero uno: non fidarti di nessuno.",
];

const pickRandomTagline = () =>
  taglines[Math.floor(Math.random() * taglines.length)];

interface Game {
  id: string;
  name: string;
  players: string;
  description: string;
  longDescription: string;
  status: "available" | "soon";
  route?: string;
}

const games: Game[] = [
    {
        id: "impostor",
        name: "Impostor",
        players: "4–10 giocatori",
        description: "Qualcuno nasconde qualcosa. Sus!",
        longDescription:
            "Ogni giocatore riceve un ruolo segreto. Tutti conoscono la parola tranne l'impostore, che dovrà confondersi tra gli altri e cercare di non farsi scoprire.",
        status: "available",
        route: "/impostor",
    },
    {
        id: "psychologist",
        name: "Psychologist",
        players: "2–10 giocatori",
        description: "Ascolta tutti. Indovina il sintomo!",
        longDescription:
            "Un giocatore interpreta il paziente mentre gli altri cercano di capire il suo misterioso sintomo facendo domande e ascoltando attentamente le risposte.",
        status: "available",
    },
    {
        id: "numbers",
        name: "Numbers",
        players: "3–10 giocatori",
        description: "Riuscite ad ordinarvi senza dire numeri?",
        longDescription:
            "Collaborate con gli altri giocatori per riuscire a mettervi in ordine senza mai pronunciare numeri. Comunicazione e intuito saranno fondamentali.",
        status: "available",
    },
    {
        id: "soon-1",
        name: "Prossimamente",
        players: "?",
        description: "Un altro gioco matto in arrivo.",
        longDescription:
            "Stiamo preparando qualcosa di nuovo. Torna presto per scoprire il prossimo gioco!",
        status: "soon",
    },
    {
        id: "soon-2",
        name: "Prossimamente",
        players: "?",
        description: "Un altro gioco matto in arrivo.",
        longDescription:
            "Stiamo preparando qualcosa di nuovo. Torna presto per scoprire il prossimo gioco!",
        status: "soon",
    },
    {
        id: "soon-3",
        name: "Prossimamente",
        players: "?",
        description: "Un altro gioco matto in arrivo.",
        longDescription:
            "Stiamo preparando qualcosa di nuovo. Torna presto per scoprire il prossimo gioco!",
        status: "soon",
    },
];

// Leggera rotazione alternata per l'effetto "mazzo sventagliato"
const cardTilt = (index: number) => (index % 2 === 0 ? "-rotate-1" : "rotate-1");

const Home = () => {
const navigate = useNavigate();
const [tagline] = useState(pickRandomTagline);
const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  return (
    <div
      className="min-h-screen bg-ink flex flex-col items-center px-5 pb-10"
      style={{
        paddingTop: "max(2.5rem, env(safe-area-inset-top))",
        paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Hero */}
      <header className="flex flex-col items-center text-center gap-3 mb-10">
        <div className="relative">
          <div className="absolute inset-0 bg-hot/30 blur-2xl rounded-full" aria-hidden="true" />
          <img
            src={logo}
            alt="MattoGames"
            className="relative w-24 h-24 rounded-2xl shadow-lg shadow-black/40 rotate-[-3deg]"
          />
        </div>
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl tracking-tight text-cream">
          Matto<span className="text-hot">Games</span>
        </h1>
        <p className="font-body text-muted text-base sm:text-lg max-w-xs">
          {tagline}
        </p>
      </header>

      {/* Lista giochi */}
        <main className="w-full max-w-md flex flex-col gap-5 sm:grid sm:grid-cols-2 sm:gap-6 sm:max-w-2xl">
            {games.map((game, index) => {
                const isGhost = game.status === "soon";
                const isPlayable = game.status === "available" && Boolean(game.route);
                const isComingSoon = game.status === "available" && !game.route;

                if (isGhost) {
                    return (
                        <div
                            key={game.id}
                            className="rounded-3xl p-5 border-2 border-dashed border-white/10 opacity-60"
                        >
                            <span className="font-display font-bold text-xl text-cream">
                                {game.name}
                            </span>

                            <p className="font-body text-sm text-muted mt-1">
                                {game.description}
                            </p>
                        </div>
                    );
                }

                return (
                    <button
                        key={game.id}
                        disabled={!isPlayable}
                        onClick={() => isPlayable && game.route && navigate(game.route)}
                        className={[
                            "group relative text-left rounded-3xl p-5 transition-all duration-200 ease-out",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-glow focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
                            isPlayable
                                ? [
                                    "bg-surface border border-white/5 shadow-xl shadow-black/30",
                                    cardTilt(index),
                                    "hover:rotate-0 active:rotate-0 active:scale-[0.97]",
                                    "hover:shadow-hot/20",
                                ].join(" ")
                                : "bg-surface/40 border-2 border-dashed border-glow/30 cursor-not-allowed",
                        ].join(" ")}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <span className="font-display font-bold text-xl text-cream">
                                {game.name}
                            </span>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedGame(game);
                                }}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-cream"
                            >
                                ℹ️
                            </button>
                        </div>

                        <p className="font-body text-sm text-muted mt-1">
                            {game.description}
                        </p>

                        <span
                            className={[
                                "inline-block mt-4 font-body text-xs font-semibold tracking-wide px-3 py-1 rounded-full",
                                isPlayable
                                    ? "bg-glow/15 text-glow"
                                    : "bg-white/5 text-muted",
                            ].join(" ")}
                        >
                            {game.players}
                        </span>

                        {isComingSoon && (
                            <span className="inline-block ml-2 mt-4 font-body text-xs font-semibold tracking-wide px-3 py-1 rounded-full bg-glow/10 text-glow/80">
                                Presto disponibile
                            </span>
                        )}
                    </button>
                );
            })}
        </main>

        {selectedGame && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
                <div className="bg-surface rounded-3xl p-6 max-w-sm w-full shadow-xl">
                    <h2 className="font-display font-extrabold text-2xl text-cream">
                        {selectedGame.name}
                    </h2>

                    <p className="font-body text-sm text-muted mt-4">
                        {selectedGame.longDescription}
                    </p>

                    <button
                        type="button"
                        onClick={() => setSelectedGame(null)}
                        className="mt-6 w-full bg-hot text-ink font-display font-extrabold py-3 rounded-xl hover:bg-hot/90 transition"
                    >
                        Chiudi
                    </button>
                </div>
            </div>
        )}
    </div>
  );
};

export default Home;