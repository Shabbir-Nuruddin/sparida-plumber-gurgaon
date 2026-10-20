import { motion, useTransform, type MotionValue } from "motion/react";

/** Flat SVG pipework: the coupling leaks (or sparks), the valve wheel turns and a clamp slides
 *  over the joint as you scroll, then the leak stops. No WebGL, so it stays smooth on any phone. */
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

const STEEL = "#8f9196";
const STEEL_HI = "#d9dde3";
const STEEL_LO = "#5d5f63";
const WATER = "#42c6ff";
const SPARK = "#ffd75e";
const Y = 250;
const CX = 440;

const CSS = `
.ps-drop{animation:ps-drop 1.15s cubic-bezier(.55,0,1,.6) infinite}
.ps-jet{stroke-dasharray:10 16;animation:ps-jet .7s linear infinite}
.ps-ring{transform-box:fill-box;transform-origin:center;animation:ps-ring 1.6s ease-out infinite}
.ps-spark .ps-jet{stroke-dasharray:4 22;animation-duration:.35s}
@keyframes ps-drop{0%{transform:translateY(0);opacity:0}12%{opacity:1}100%{transform:translateY(262px);opacity:.9}}
@keyframes ps-jet{to{stroke-dashoffset:-26}}
@keyframes ps-ring{0%{transform:scale(.2);opacity:.7}100%{transform:scale(1.6);opacity:0}}
.ps-still *{animation:none!important}
`;

function Nut({ x, y = Y, h = 66 }: { x: number; y?: number; h?: number }) {
  return (
    <g>
      <rect x={x - 11} y={y - h / 2} width={22} height={h} rx={3} fill={STEEL} />
      <rect x={x - 11} y={y - h / 2} width={22} height={9} rx={3} fill={STEEL_HI} />
      <rect x={x - 2} y={y - h / 2} width={4} height={h} fill={STEEL_LO} opacity={0.5} />
    </g>
  );
}

export default function PipeScene({
  progress,
  lite,
  still,
  mode = "leak",
}: {
  progress: MotionValue<number>;
  lite: boolean;
  interactive?: boolean;
  still: boolean;
  mode?: "leak" | "spark";
}) {
  const spark = mode === "spark";
  const tint = spark ? SPARK : WATER;
  const wheel = useTransform(progress, (p) => -smooth(0.5, 0.74, p) * 540);
  const clampX = useTransform(progress, (p) => (smooth(0.6, 0.8, p) - 1) * 130);
  const clampOn = useTransform(progress, (p) => (smooth(0.6, 0.8, p) > 0.01 ? 1 : 0));
  const fixed = useTransform(progress, (p) => smooth(0.74, 0.82, p));
  const flow = useTransform(progress, (p) => 1 - smooth(0.6, 0.78, p));
  const puddle = useTransform(progress, (p) => 1 - smooth(0.65, 0.95, p) * 0.75);
  const drift = useTransform(progress, [0, 1], [0, -40]);

  const drops = lite ? [0, 1, 2, 3] : [0, 1, 2, 3, 4, 5, 6];
  const jets = spark
    ? ["M440 220 q40 -70 110 -40", "M440 220 q-30 -80 -100 -50", "M440 220 q70 -20 120 40", "M440 220 q-60 -10 -110 50", "M440 220 q10 -90 30 -120"]
    : ["M446 222 q50 -70 120 10 t40 120", "M440 222 q70 -40 110 40 t20 160", "M434 222 q30 -90 90 -40"];

  return (
    <div className="absolute inset-0 flex items-start justify-center pt-24 md:items-center md:justify-end md:pt-0 md:pr-[3vw]">
      <style>{CSS}</style>
      <motion.svg
        viewBox="0 0 800 600"
        className={`h-auto w-[min(108%,640px)] md:w-[min(60vw,880px)] ${still ? "ps-still" : ""} ${spark ? "ps-spark" : ""}`}
        style={{ y: drift }}
        aria-hidden="true"
      >
        {/* wall: plaster panel with tile joints */}
        <rect x="0" y="0" width="800" height="540" fill="#1a1b1e" />
        {[90, 180, 270, 360, 450].map((y) => (
          <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#232428" strokeWidth="2" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((r) =>
          [0, 1, 2, 3, 4].map((c) => {
            const x = c * 180 + (r % 2 ? 90 : 0);
            return <line key={`${r}-${c}`} x1={x} x2={x} y1={r * 90} y2={r * 90 + 90} stroke="#232428" strokeWidth="2" />;
          }),
        )}
        {/* floor */}
        <rect x="0" y="540" width="800" height="60" fill="#141517" />
        <line x1="0" x2="800" y1="540" y2="540" stroke="#2b2c30" strokeWidth="3" />

        {/* background pipes */}
        <rect x="0" y="96" width="800" height="22" fill="#3c3e42" />
        <rect x="0" y="96" width="800" height="5" fill="#55575c" />
        <rect x="96" y="0" width="24" height="540" fill="#36383c" />
        <rect x="96" y="0" width="6" height="540" fill="#4b4d52" />

        {/* wall brackets */}
        {[60, 150].map((x) => (
          <rect key={x} x={x} y={Y - 38} width="16" height="76" rx="3" fill={STEEL_LO} />
        ))}

        {/* main run */}
        <rect x="-10" y={Y - 22} width="602" height="44" fill={STEEL} />
        <rect x="-10" y={Y - 22} width="602" height="10" fill={STEEL_HI} />
        <rect x="-10" y={Y + 12} width="602" height="10" fill={STEEL_LO} />
        {/* elbow and drop to the floor */}
        <path d={`M592 ${Y - 22} A 66 66 0 0 1 658 ${Y + 44} L 614 ${Y + 44} A 22 22 0 0 0 592 ${Y + 22} Z`} fill={STEEL} />
        <path d={`M592 ${Y - 22} A 66 66 0 0 1 658 ${Y + 44} L 648 ${Y + 44} A 56 56 0 0 0 592 ${Y - 12} Z`} fill={STEEL_HI} />
        <rect x="614" y={Y + 44} width="44" height={540 - Y - 44} fill={STEEL} />
        <rect x="648" y={Y + 44} width="10" height={540 - Y - 44} fill={STEEL_HI} />
        <rect x="614" y={Y + 44} width="10" height={540 - Y - 44} fill={STEEL_LO} />
        <rect x="606" y="420" width="60" height="22" rx="3" fill={STEEL} />
        <rect x="606" y="420" width="60" height="6" rx="3" fill={STEEL_HI} />

        {/* the leaking coupling */}
        <rect x={CX - 32} y={Y - 34} width="64" height="68" rx="6" fill={STEEL} />
        <rect x={CX - 32} y={Y - 34} width="64" height="14" rx="6" fill={STEEL_HI} />
        <motion.rect x={CX - 32} y={Y - 34} width="64" height="68" rx="6" fill="none" stroke={WATER} strokeWidth="4" style={{ opacity: fixed }} />
        <Nut x={CX - 46} />
        <Nut x={CX + 46} />

        {/* valve with turning wheel */}
        <g>
          <rect x="226" y={Y - 120} width="14" height="100" fill={STEEL_LO} />
          <circle cx="233" cy={Y} r="42" fill={STEEL} />
          <path d={`M199 ${Y - 24} A 42 42 0 0 1 267 ${Y - 24}`} stroke={STEEL_HI} strokeWidth="9" fill="none" />
          <motion.g style={{ rotate: wheel, transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="233" cy={Y - 128} r="52" fill="none" stroke={WATER} strokeWidth="11" />
            {[0, 45, 90, 135].map((a) => (
              <rect key={a} x="181" y={Y - 132} width="104" height="8" rx="4" fill={STEEL_HI} transform={`rotate(${a} 233 ${Y - 128})`} />
            ))}
            <circle cx="233" cy={Y - 128} r="12" fill={STEEL} />
            <circle cx="233" cy={Y - 180} r="6" fill="#ffffff" />
          </motion.g>
        </g>

        {/* repair clamp slides in from the left */}
        <motion.g style={{ x: clampX, opacity: clampOn }}>
          <rect x={CX - 40} y={Y - 40} width="80" height="80" rx="8" fill="#b8babf" />
          <rect x={CX - 40} y={Y - 40} width="80" height="12" rx="6" fill="#e8ebef" />
          <rect x={CX - 26} y={Y - 56} width="12" height="20" rx="2" fill={STEEL_HI} />
          <rect x={CX + 14} y={Y - 56} width="12" height="20" rx="2" fill={STEEL_HI} />
          <rect x={CX - 40} y={Y + 30} width="80" height="10" rx="5" fill={STEEL_LO} />
        </motion.g>

        {/* leak: jets from the joint, drips to the floor */}
        <motion.g style={{ opacity: flow }}>
          {jets.map((d, i) => (
            <path key={i} d={d} className="ps-jet" fill="none" stroke={tint} strokeWidth={spark ? 3 : 5} strokeLinecap="round" style={{ animationDelay: `${i * -0.21}s` }} />
          ))}
          {!spark &&
            drops.map((i) => (
              <ellipse
                key={i}
                className="ps-drop"
                cx={CX - 18 + ((i * 37) % 40)}
                cy={Y + 40}
                rx="6"
                ry="9"
                fill={WATER}
                style={{ animationDelay: `${(i * -1.15) / drops.length}s` }}
              />
            ))}
          {!spark &&
            [0, 1].map((i) => (
              <ellipse key={i} className="ps-ring" cx={CX} cy="548" rx="70" ry="12" fill="none" stroke={WATER} strokeWidth="3" style={{ animationDelay: `${i * -0.8}s` }} />
            ))}
        </motion.g>

        {/* puddle dries up once fixed */}
        {!spark && (
          <motion.ellipse cx={CX + 20} cy="550" rx="150" ry="20" fill="#0b5f8a" style={{ scaleX: puddle, opacity: puddle, transformBox: "fill-box", transformOrigin: "center" }} />
        )}
      </motion.svg>
    </div>
  );
}
