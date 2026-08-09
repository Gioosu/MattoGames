import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickRandomSymptom } from "./symptoms";

const DURATION_PRESETS = [60, 120, 180, 300, 600]; // secondi

const formatTime = (totalSeconds: number): string => {
  const clamped = Math.max(0, totalSeconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const Psychologist = () => {
  const navigate = useNavigate();

  // --- Sintomo ---
  const [symptom, setSymptom] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const generateNewSymptom = () => {
    setSymptom(pickRandomSymptom());
    setShowReveal(true);
  };

  // --- Timer ---
  // endTimestamp: quando il countdown deve arrivare a zero (null = non in
  // esecuzione). Calcolare il tempo rimasto da un timestamp assoluto invece
  // che decrementarlo a ogni tick evita derive se il browser rallenta il
  // tab in background, e resta accurato anche tornando da un'altra pagina.
  const [durationSeconds, setDurationSeconds] = useState(60);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [endTimestamp, setEndTimestamp] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const isRunning = endTimestamp !== null;
  const displayedSeconds = isRunning
    ? Math.max(0, Math.ceil((endTimestamp - now) / 1000))
    : remainingSeconds;

  // Tick del timer, solo mentre è in esecuzione
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, [isRunning]);

  // Stop automatico allo scadere
  useEffect(() => {
    if (endTimestamp !== null && now >= endTimestamp) {
      setRemainingSeconds(0);
      setEndTimestamp(null);
      if (navigator.vibrate) {
        try {
          navigator.vibrate([200, 100, 200]);
        } catch {
          // vibrazione non supportata: nessun problema, si ignora
        }
      }
    }
  }, [now, endTimestamp]);

  const selectDuration = (seconds: number) => {
    if (isRunning) return;
    setDurationSeconds(seconds);
    setRemainingSeconds(seconds);
  };

  const handleStart = () => {
    const base = displayedSeconds > 0 ? displayedSeconds : durationSeconds;
    setEndTimestamp(Date.now() + base * 1000);
  };

  const handlePause = () => {
    if (endTimestamp === null) return;
    setRemainingSeconds(Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000)));
    setEndTimestamp(null);
  };

  const handleReset = () => {
    setRemainingSeconds(durationSeconds);
    setEndTimestamp(null);
  };

  const isFresh = !isRunning && displayedSeconds === durationSeconds;
  const isExpired = !isRunning && displayedSeconds === 0;

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
                    Psycho<span className="text-hot">logist</span>
                </h1>
      </header>

      {/* Sintomo */}
      <div className="w-full max-w-md bg-surface rounded-3xl p-6 flex flex-col items-center gap-4 shadow-xl shadow-black/30">
        <p className="font-body text-muted text-xs uppercase tracking-wide">Paziente</p>

        {symptom ? (
          <>
            <p className="font-body text-muted text-sm text-center">
              Sintomo generato, tienilo segreto.
            </p>
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowReveal(true)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-cream font-body font-semibold py-3 rounded-xl transition active:scale-95"
              >
                Rivedi
              </button>
              <button
                type="button"
                onClick={generateNewSymptom}
                className="flex-1 bg-hot hover:bg-hot/90 text-ink font-display font-bold py-3 rounded-xl transition active:scale-95"
              >
                Nuovo sintomo
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={generateNewSymptom}
            className="w-full bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
          >
            Genera sintomo
          </button>
        )}
      </div>

      {/* Timer */}
      <div className="w-full max-w-md bg-surface rounded-3xl p-6 flex flex-col items-center gap-5 shadow-xl shadow-black/30 mt-6">
        <p className="font-body text-muted text-xs uppercase tracking-wide">Timer</p>

        <div className="flex gap-2 flex-wrap justify-center">
          {DURATION_PRESETS.map((seconds) => (
            <button
              key={seconds}
              type="button"
              disabled={isRunning}
              onClick={() => selectDuration(seconds)}
              className={[
                "px-3 py-2 rounded-xl font-body text-sm font-semibold transition",
                durationSeconds === seconds
                  ? "bg-glow/20 text-glow"
                  : "bg-white/5 text-muted hover:text-cream",
                isRunning ? "opacity-40 cursor-not-allowed" : "",
              ].join(" ")}
            >
              {formatTime(seconds)}
            </button>
          ))}
        </div>

        <span
          className={[
            "font-display font-extrabold text-6xl tabular-nums",
            displayedSeconds <= 10 && displayedSeconds > 0 ? "text-hot" : "text-cream",
            isExpired ? "text-hot" : "",
          ].join(" ")}
        >
          {formatTime(displayedSeconds)}
        </span>

        {isExpired && (
          <p className="font-display font-bold text-hot text-sm">Tempo scaduto!</p>
        )}

        <div className="flex gap-4 w-full">
          {!isRunning ? (
            <button
              type="button"
              onClick={handleStart}
              className="flex-1 bg-hot hover:bg-hot/90 text-ink font-display font-extrabold py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
            >
              {isFresh ? "Avvia" : isExpired ? "Riavvia" : "Riprendi"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePause}
              className="flex-1 bg-white/10 hover:bg-white/20 text-cream font-display font-extrabold py-4 rounded-2xl transition active:scale-[0.97]"
            >
              Pausa
            </button>
          )}
          <button
            type="button"
            onClick={handleReset}
            disabled={isFresh}
            className="px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-muted font-body font-semibold transition active:scale-[0.97] disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Rivelazione privata del sintomo */}
      {showReveal && symptom && (
        <div className="fixed inset-0 bg-ink flex flex-col items-center justify-center gap-6 px-6 z-50">
          <span className="font-body text-muted text-sm text-center">
            Il paziente: non far vedere lo schermo agli altri
          </span>
          <p className="font-display font-bold text-2xl text-cream text-center max-w-sm">
            {symptom}
          </p>
          <button
            type="button"
            onClick={() => setShowReveal(false)}
            className="w-full max-w-xs mt-4 bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
          >
            Ho visto, nascondi
          </button>
        </div>
      )}
    </div>
  );
};

export default Psychologist;