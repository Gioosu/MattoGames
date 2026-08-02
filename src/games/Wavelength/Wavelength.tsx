import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pickRandomTheme, type Theme } from "./themes";

type Phase = "hidden" | "revealing" | "guessing" | "scored";

// Geometria del semicerchio, in unità del viewBox SVG
const SVG_WIDTH = 320;
const SVG_HEIGHT = 195;
const CENTER_X = 160;
const CENTER_Y = 178;
const TRACK_RADIUS = 140;
const BAND_RADIUS = 128;
const BAND_WIDTH = 26;
const NEEDLE_LENGTH = 146;

// value: 0 = polo sinistro, 100 = polo destro
const valueToAngleRad = (value: number) => ((100 - value) / 100) * Math.PI;

const pointForValue = (value: number, radius: number) => {
  const angle = valueToAngleRad(value);
  return {
    x: CENTER_X + radius * Math.cos(angle),
    y: CENTER_Y - radius * Math.sin(angle),
  };
};

// Arco (non riempito, solo tracciato) tra due valori sulla circonferenza
const arcPath = (vStart: number, vEnd: number, radius: number) => {
  const p1 = pointForValue(vStart, radius);
  const p2 = pointForValue(vEnd, radius);
  return `M ${p1.x} ${p1.y} A ${radius} ${radius} 0 0 1 ${p2.x} ${p2.y}`;
};

interface Band {
  start: number;
  end: number;
  color: string;
  opacity: number;
}

// Le 5 fasce di punteggio (1-2-4-2-1) centrate sul bersaglio nascosto
const bandsForTarget = (target: number): Band[] =>
  [
    { start: target - 18, end: target - 10, color: "#FFC857", opacity: 0.45 },
    { start: target - 10, end: target - 4, color: "#FFC857", opacity: 0.85 },
    { start: target - 4, end: target + 4, color: "#FF5D73", opacity: 1 },
    { start: target + 4, end: target + 10, color: "#FFC857", opacity: 0.85 },
    { start: target + 10, end: target + 18, color: "#FFC857", opacity: 0.45 },
  ].map((b) => ({ ...b, start: Math.max(0, b.start), end: Math.min(100, b.end) }));

const computeScore = (guess: number, target: number): number => {
  const diff = Math.abs(guess - target);
  if (diff <= 4) return 4;
  if (diff <= 10) return 2;
  if (diff <= 18) return 1;
  return 0;
};

// Target lontano dai bordi, così le fasce da 18 unità ci stanno sempre dentro
const randomTargetCenter = () => 20 + Math.random() * 60;

const Wavelength = () => {
  const navigate = useNavigate();
  const svgRef = useRef<SVGSVGElement>(null);
  const isDraggingRef = useRef(false);

  const [theme, setTheme] = useState<Theme>(() => pickRandomTheme());
  const [targetCenter, setTargetCenter] = useState<number>(randomTargetCenter);
  const [phase, setPhase] = useState<Phase>("hidden");
  const [guessValue, setGuessValue] = useState(50);

  const startNewRound = () => {
    setTheme(pickRandomTheme());
    setTargetCenter(randomTargetCenter());
    setGuessValue(50);
    setPhase("hidden");
  };

  const valueFromPointer = (clientX: number, clientY: number): number => {
    const svg = svgRef.current;
    if (!svg) return 50;
    const rect = svg.getBoundingClientRect();
    const x = (clientX - rect.left) * (SVG_WIDTH / rect.width);
    const y = (clientY - rect.top) * (SVG_HEIGHT / rect.height);
    const dx = x - CENTER_X;
    const dy = Math.max(CENTER_Y - y, 0.0001); // resta sempre nel quadrante superiore
    const angle = Math.max(0, Math.min(Math.PI, Math.atan2(dy, dx)));
    return Math.round(100 - (angle / Math.PI) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if (phase !== "guessing") return;
    svgRef.current?.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    setGuessValue(valueFromPointer(e.clientX, e.clientY));
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDraggingRef.current) return;
    setGuessValue(valueFromPointer(e.clientX, e.clientY));
  };

  const stopDragging = () => {
    isDraggingRef.current = false;
  };

  const needleTip = pointForValue(guessValue, NEEDLE_LENGTH);
  const showBands = phase === "revealing" || phase === "scored";
  const score = phase === "scored" ? computeScore(guessValue, targetCenter) : null;

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
        <h1 className="font-display font-extrabold text-3xl text-cream">Wavelength</h1>
      </header>

      <div className="w-full max-w-md bg-surface rounded-3xl p-5 shadow-xl shadow-black/30 flex flex-col items-center gap-4">
        <p className="font-body text-muted text-xs uppercase tracking-wide">Tema</p>
        <p className="font-display font-bold text-xl text-cream text-center">{theme.topic}</p>

        <svg
          ref={svgRef}
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="w-full touch-none select-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
        >
          {/* Guida neutra, sempre visibile */}
          <path
            d={arcPath(0, 100, TRACK_RADIUS)}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={BAND_WIDTH}
          />

          {/* Fasce di punteggio: solo quando il bersaglio è rivelato */}
          {showBands &&
            bandsForTarget(targetCenter).map((band, i) => (
              <path
                key={i}
                d={arcPath(band.start, band.end, BAND_RADIUS)}
                fill="none"
                stroke={band.color}
                strokeOpacity={band.opacity}
                strokeWidth={BAND_WIDTH}
              />
            ))}

          {/* Lancetta: mostra il bersaglio (rivelazione) o il tentativo (guessing/scored) */}
          <line
            x1={CENTER_X}
            y1={CENTER_Y}
            x2={needleTip.x}
            y2={needleTip.y}
            className="stroke-cream"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <circle cx={CENTER_X} cy={CENTER_Y} r={7} className="fill-cream" />
        </svg>

        {/* Etichette dei poli in HTML normale, non nell'SVG: un testo lungo
            (es. "Fabbricato in serie") andrebbe a capo o sforerebbe fuori dal
            viewBox invisibile, senza che l'utente capisca perché è sparito.
            Qui invece va semplicemente a capo, non si taglia mai. */}
        <div className="w-full flex justify-between items-start gap-3 -mt-2 px-1">
          <span className="font-body text-xs sm:text-sm font-semibold text-muted text-left max-w-[45%]">
            {theme.poleLeft}
          </span>
          <span className="font-body text-xs sm:text-sm font-semibold text-muted text-right max-w-[45%]">
            {theme.poleRight}
          </span>
        </div>

        {phase === "scored" && (
          <p className="font-display font-extrabold text-2xl text-glow">
            {score} punt{score === 1 ? "o" : "i"}!
          </p>
        )}
      </div>

      <div className="w-full max-w-md mt-6 flex flex-col items-center gap-3">
        {phase === "hidden" && (
          <>
            <p className="font-body text-muted text-sm text-center max-w-xs">
              Chi dà l'indizio tocca qui, guarda dove cade il bersaglio e dice ad
              alta voce un esempio lungo lo spettro (es. una città, un piatto...).
            </p>
            <button
              type="button"
              onClick={() => setPhase("revealing")}
              className="w-full bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
            >
              Rivela il bersaglio
            </button>
          </>
        )}

        {phase === "revealing" && (
          <>
            <p className="font-body text-cream text-sm text-center max-w-xs">
              Non far vedere lo schermo agli altri. Guarda dove cade il
              bersaglio, pensa a un indizio e dillo ad alta voce.
            </p>
            <button
              type="button"
              onClick={() => setPhase("guessing")}
              className="w-full bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
            >
              Ho visto, nascondi
            </button>
          </>
        )}

        {phase === "guessing" && (
          <>
            <p className="font-body text-muted text-sm text-center max-w-xs">
              Trascina la lancetta dove pensi che sia il bersaglio, poi conferma.
            </p>
            <button
              type="button"
              onClick={() => setPhase("scored")}
              className="w-full bg-hot hover:bg-hot/90 text-ink font-display font-extrabold text-lg py-4 rounded-2xl shadow-xl shadow-hot/20 transition active:scale-[0.97]"
            >
              Conferma
            </button>
          </>
        )}

        {phase === "scored" && (
          <button
            type="button"
            onClick={startNewRound}
            className="w-full bg-white/5 hover:bg-white/10 text-cream font-display font-bold text-lg py-4 rounded-2xl transition active:scale-[0.97]"
          >
            Nuovo turno
          </button>
        )}
      </div>
    </div>
  );
};

export default Wavelength;