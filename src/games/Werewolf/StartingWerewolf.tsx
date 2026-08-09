import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MIN_PLAYERS = 4;
const MAX_PLAYERS = 20;

export interface ImpostorSettings {
    players: number;
    impostors: number;
    withClue: boolean;
}

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
        <div className="flex items-center justify-between gap-4 py-4">
            <span className="font-body text-cream text-base">{label}</span>
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={decrease}
                    disabled={value <= min}
                    aria-label={`Diminuisci ${label.toLowerCase()}`}
                    className="w-11 h-11 rounded-full bg-white/5 text-cream text-xl font-display font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:active:scale-100"
                >
                    −
                </button>
                <span className="font-display font-extrabold text-2xl text-glow w-8 text-center tabular-nums">
                    {value}
                </span>
                <button
                    type="button"
                    onClick={increase}
                    disabled={value >= max}
                    aria-label={`Aumenta ${label.toLowerCase()}`}
                    className="w-11 h-11 rounded-full bg-white/5 text-cream text-xl font-display font-bold flex items-center justify-center transition active:scale-90 disabled:opacity-30 disabled:active:scale-100"
                >
                    +
                </button>
            </div>
        </div>
    );
};

const StartingImpostor = () => {
    const navigate = useNavigate();
    const [players, setPlayers] = useState(6);
    const [impostors, setImpostors] = useState(1);
    const [withClue, setWithClue] = useState(true);
    const [showClueInfo, setShowClueInfo] = useState(false);

    const handlePlayersChange = (next: number) => {
        setPlayers(next);
        // Non ha senso avere più impostori dei giocatori onesti: devono
        // restare almeno 2 giocatori che conoscono davvero la parola.
        setImpostors((current) => Math.min(current, Math.max(1, next - 2)));
    };

    const isValid = players >= MIN_PLAYERS && impostors >= 1 && impostors <= players - 2;

    const handleStart = () => {
        const settings: ImpostorSettings = { players, impostors, withClue };
        navigate("/impostor/play", { state: settings });
    };

    return (
        <div
            className="min-h-screen bg-ink flex flex-col items-center px-5"
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
                <h1 className="font-display font-extrabold text-4xl text-cream">
                    Impost<span className="text-hot">or</span>
                </h1>
                <p className="font-body text-muted text-base max-w-xs">
                    Uno di voi non conosce la parola segreta. Scopritelo prima che sia
                    troppo tardi.
                </p>
            </header>

            <main className="w-full max-w-md bg-surface rounded-3xl px-6 py-2 divide-y divide-white/5 shadow-xl shadow-black/30">
                <Stepper
                    label="Giocatori"
                    value={players}
                    min={MIN_PLAYERS}
                    max={MAX_PLAYERS}
                    onChange={handlePlayersChange}
                />
                <Stepper
                    label="Impostori"
                    value={impostors}
                    min={1}
                    max={Math.max(1, players - 2)}
                    onChange={setImpostors}
                />

                <div className="flex items-center justify-between gap-4 py-4">
                    <span className="font-body text-cream text-base">Indizio</span>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            role="switch"
                            aria-checked={withClue}
                            onClick={() => setWithClue((current) => !current)}
                            className={[
                                "relative w-14 h-8 rounded-full transition-colors duration-200 shrink-0",
                                withClue ? "bg-hot" : "bg-white/10",
                            ].join(" ")}
                        >
                            <span
                                className={[
                                    "absolute top-1 left-1 w-6 h-6 rounded-full bg-cream shadow transition-transform duration-200",
                                    withClue ? "translate-x-6" : "translate-x-0",
                                ].join(" ")}
                            />
                        </button>

                        <button
                            type="button"
                            aria-label="Informazioni su Indizio"
                            onClick={() => setShowClueInfo(true)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition flex items-center justify-center text-cream shrink-0"
                        >
                            ℹ️
                        </button>
                    </div>
                </div>
            </main>

            {showClueInfo && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-5">
                    <div className="bg-surface rounded-3xl p-6 max-w-sm w-full shadow-xl">
                        <h2 className="font-display font-extrabold text-xl text-cream">Indizio</h2>
                        <p className="font-body text-sm text-muted mt-4">
                            Se attivo, l'impostore riceve un piccolo indizio collegato
                            alla parola segreta invece di restare completamente al
                            buio — rende il gioco più equilibrato con gruppi piccoli
                            o alle prime partite. Disattivalo per una sfida più dura.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowClueInfo(false)}
                            className="mt-6 w-full bg-hot text-ink font-display font-extrabold py-3 rounded-xl hover:bg-hot/90 transition"
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}

            {!isValid && (
                <p className="font-body text-xs text-muted mt-4">
                    Servono almeno {MIN_PLAYERS} giocatori e meno impostori dei
                    giocatori.
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

export default StartingImpostor;