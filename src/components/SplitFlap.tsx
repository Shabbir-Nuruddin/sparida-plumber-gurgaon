// Adapted from 21st.dev "Split Flap Display" (@componentry): re-skinned to the
// dispatch board, sized with a CSS variable so a row fits a 360px phone, and
// stepping with a timeout chain instead of nested state timers.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:.-/'";

function Cell({ target, delay, speed }: { target: string; delay: number; speed: number }) {
  const reduced = useReducedMotion();
  const [char, setChar] = useState(reduced ? target : " ");
  const [prev, setPrev] = useState(" ");
  const [tick, setTick] = useState(0);
  const current = useRef(char);

  useEffect(() => {
    if (reduced) {
      current.current = target;
      setChar(target);
      return;
    }
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      const c = current.current;
      if (c === target) return;
      const i = CHARS.indexOf(c);
      const next = CHARS[(i + 1) % CHARS.length];
      setPrev(c);
      current.current = next;
      setChar(next);
      setTick((n) => n + 1);
      t = setTimeout(step, speed);
    };
    t = setTimeout(step, delay);
    return () => clearTimeout(t);
  }, [target, delay, speed, reduced]);

  const half = "absolute inset-x-0 h-1/2 overflow-hidden";
  const glyph = "absolute left-1/2 -translate-x-1/2 leading-none";

  return (
    <span
      aria-hidden
      className="relative inline-block font-display font-semibold"
      style={{
        width: "var(--cw)",
        height: "calc(var(--cw) * 1.42)",
        fontSize: "calc(var(--cw) * 0.9)",
        perspective: "300px",
      }}
    >
      <span className={`${half} top-0 rounded-t-[3px] bg-[#232427]`}>
        <span className={`${glyph} bottom-0 translate-y-1/2 text-ink`}>{char}</span>
      </span>
      <span className={`${half} bottom-0 rounded-b-[3px] bg-[#1b1c1f]`}>
        <span className={`${glyph} top-0 -translate-y-1/2 text-ink/90`}>{char}</span>
      </span>
      {tick > 0 ? (
        <span
          key={tick}
          className={`${half} top-0 z-10 rounded-t-[3px] bg-[#2a2b2f]`}
          style={{ transformOrigin: "bottom", animation: `flap-top ${speed * 0.9}ms ease-in forwards` }}
        >
          <span className={`${glyph} bottom-0 translate-y-1/2 text-ink`}>{prev}</span>
        </span>
      ) : null}
      <span className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-night" />
    </span>
  );
}

export function SplitFlapRow({
  text,
  columns,
  speed = 38,
  stagger = 26,
  label,
}: {
  text: string;
  columns: number;
  speed?: number;
  stagger?: number;
  label?: string;
}) {
  const padded = text.toUpperCase().padEnd(columns, " ").slice(0, columns);
  return (
    <span className="flex gap-[3px]" role="text" aria-label={label ?? text}>
      {padded.split("").map((c, i) => (
        <Cell key={i} target={c} delay={i * stagger} speed={speed} />
      ))}
    </span>
  );
}
