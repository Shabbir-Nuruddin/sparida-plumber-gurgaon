import { AnimatePresence, animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Camera, Check, ArrowsClockwise, Quotes } from "@phosphor-icons/react";
import { FEATURE, PHONE_DISPLAY } from "../content";
import type { Feature, Lang } from "../lib";

const EASE = [0.16, 1, 0.3, 1] as const;
type P = { lang: Lang; reduced: boolean; source: string };

const H2 = "font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold uppercase leading-[0.95] text-balance";

function Quote({ text, source, className = "" }: { text: string; source: string; className?: string }) {
  return (
    <figure className={`border-l-2 border-water pl-5 ${className}`}>
      <blockquote className="text-[clamp(1.15rem,2vw,1.4rem)] leading-snug text-ink">“{text}”</blockquote>
      <figcaption className="mt-2 text-[13px] text-ink-3">{source}</figcaption>
    </figure>
  );
}

function Rise({ children, reduced, delay = 0, className = "" }: { children: React.ReactNode; reduced: boolean; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A stopwatch that runs from 0 to the promised minutes when it scrolls in. */
function ClockFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "clock" }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const [m, setM] = useState(reduced ? f.minutes : 0);
  useEffect(() => {
    if (!inView || reduced) return;
    const c = animate(0, f.minutes, { duration: 2.4, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setM(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduced, f.minutes]);
  const R = 132;
  const C = 2 * Math.PI * R;
  return (
    <section className="relative mx-auto grid max-w-[1240px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-36">
      <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[380px]">
        <svg viewBox="0 0 300 300" className="h-full w-full -rotate-90">
          <circle cx="150" cy="150" r={R} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeWidth="10" />
          {Array.from({ length: 60 }, (_, i) => (
            <line key={i} x1="150" y1={150 - R - 16} x2="150" y2={150 - R - (i % 5 ? 20 : 26)} stroke={i < m * 2 ? "#42c6ff" : "rgb(255 255 255 / 0.18)"} strokeWidth={i % 5 ? 1.5 : 2.5} transform={`rotate(${i * 6} 150 150)`} />
          ))}
          <circle cx="150" cy="150" r={R} fill="none" stroke="#42c6ff" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - m / 60)} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-[clamp(5rem,14vw,8.5rem)] font-bold leading-[0.8] tabular-nums text-ink">{m}</span>
          <span className="mt-2 font-display text-[20px] font-semibold uppercase tracking-[0.12em] text-water">{lang === "hi" ? "मिनट" : "minutes"}</span>
        </div>
      </div>
      <div>
        <h2 className={H2}>{f.title[lang]}</h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {f.moments.map((x, i) => (
            <Rise key={i} reduced={reduced} delay={i * 0.08}>
              <li className="grid gap-2 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
                <span className="font-display text-[18px] font-semibold uppercase tracking-[0.06em] text-water">{x.when[lang]}</span>
                <span className="text-[17px] leading-snug text-ink">
                  “{x.quote}” <span className="text-[13px] text-ink-3">{source}</span>
                </span>
              </li>
            </Rise>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CompareFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "compare" }> }) {
  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
        <h2 className={H2}>{f.title[lang]}</h2>
        <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
      </div>
      <div className="mt-14 overflow-hidden rounded-[14px] border border-line">
        <div className="grid grid-cols-[1fr_1fr] bg-night-2 text-[13px] font-semibold uppercase tracking-[0.08em] sm:grid-cols-[1fr_1fr_1fr]">
          <span className="hidden px-5 py-4 text-ink-3 sm:block" />
          <span className="px-5 py-4 text-ink-3">{f.left[lang]}</span>
          <span className="bg-water/10 px-5 py-4 text-water">{f.right[lang]}</span>
        </div>
        {f.rows.map((r, i) => (
          <Rise key={i} reduced={reduced} delay={i * 0.07}>
            <div className="grid grid-cols-[1fr_1fr] border-t border-line sm:grid-cols-[1fr_1fr_1fr]">
              <span className="col-span-2 px-5 pt-5 font-display text-[20px] font-semibold uppercase leading-tight sm:col-span-1 sm:py-6">{r.label[lang]}</span>
              <span className="px-5 py-5 text-[16px] leading-snug text-ink-3 sm:py-6">{r.left[lang]}</span>
              <span className="bg-water/[0.06] px-5 py-5 text-[16px] leading-snug text-ink sm:py-6">{r.right[lang]}</span>
            </div>
          </Rise>
        ))}
      </div>
      <Quote text={f.quote} source={source} className="mt-12 max-w-[640px]" />
    </section>
  );
}

function TimelineFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "timeline" }> }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  if (f.layout === "stack")
    return (
      <section className="relative mx-auto grid max-w-[1240px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-[1fr_1fr] lg:py-36">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className={H2}>{f.title[lang]}</h2>
          <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
          {f.img && (
            <figure className="mt-10">
              <img src={f.img} alt="" loading="lazy" className="aspect-[4/3] w-full rounded-[14px] border border-line object-cover" />
              {f.imgCaption && <figcaption className="mt-3 text-[14px] text-ink-3">{f.imgCaption[lang]}</figcaption>}
            </figure>
          )}
        </div>
        <ol ref={ref} className="relative space-y-12 pl-14">
          <span className="absolute bottom-2 left-[19px] top-2 w-[2px] bg-line" />
          <motion.span className="absolute left-[19px] top-2 w-[2px] bg-water" style={{ height: reduced ? "100%" : fill }} />
          {f.steps.map((s, i) => (
            <Rise key={i} reduced={reduced}>
              <li className="relative">
                <span className="absolute -left-14 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-water bg-night font-display text-[18px] font-bold text-water">{i + 1}</span>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-semibold uppercase leading-tight">{s.label[lang]}</h3>
                <p className="mt-2 max-w-[44ch] text-[17px] leading-relaxed text-ink-2">{s.body[lang]}</p>
              </li>
            </Rise>
          ))}
          <Rise reduced={reduced}>
            <Quote text={f.quote} source={source} />
          </Rise>
        </ol>
      </section>
    );
  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-24 sm:px-8 lg:py-36">
      <h2 className={`${H2} max-w-[20ch]`}>{f.title[lang]}</h2>
      <p className="mt-5 max-w-[56ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
      <ol ref={ref} className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
        <span className="absolute left-0 right-0 top-[19px] hidden h-[2px] bg-line md:block" />
        <motion.span className="absolute left-0 top-[19px] hidden h-[2px] bg-water md:block" style={{ width: reduced ? "100%" : fill }} />
        {f.steps.map((s, i) => (
          <Rise key={i} reduced={reduced} delay={i * 0.1}>
            <li className="relative">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-water bg-night font-display text-[18px] font-bold text-water">{i + 1}</span>
              {s.img && <img src={s.img} alt="" loading="lazy" className="mt-6 aspect-[4/3] w-full rounded-[14px] border border-line object-cover" />}
              <h3 className="mt-5 font-display text-[24px] font-semibold uppercase leading-tight">{s.label[lang]}</h3>
              <p className="mt-2 text-[16px] leading-relaxed text-ink-2">{s.body[lang]}</p>
            </li>
          </Rise>
        ))}
      </ol>
      <Quote text={f.quote} source={source} className="mt-16 max-w-[720px]" />
    </section>
  );
}

function TracksFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "tracks" }> }) {
  const [i, setI] = useState(0);
  const tr = f.tracks[i];
  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
        <h2 className={H2}>{f.title[lang]}</h2>
        <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
      </div>
      <div role="tablist" className="mt-12 flex flex-wrap gap-2">
        {f.tracks.map((x, j) => (
          <button
            key={j}
            role="tab"
            aria-selected={i === j}
            onClick={() => setI(j)}
            className={`cursor-pointer rounded-full border px-5 py-2.5 text-[16px] font-semibold transition-colors duration-200 active:scale-[0.97] ${i === j ? "border-water bg-water text-night" : "border-line text-ink-2 hover:border-water/50 hover:text-ink"}`}
          >
            {x.label[lang]}
          </button>
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] border border-line bg-night-2">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.img
              key={tr.img}
              src={tr.img}
              alt={tr.label[lang]}
              className="absolute inset-0 h-full w-full object-cover"
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            />
          </AnimatePresence>
        </div>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={`${i}-${lang}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.4, ease: EASE }}>
            <h3 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold uppercase leading-none">{tr.label[lang]}</h3>
            <p className="mt-4 max-w-[44ch] text-[17px] leading-relaxed text-ink-2">{tr.body[lang]}</p>
            <Quote text={tr.quote} source={source} className="mt-8" />
          </motion.div>
        </AnimatePresence>
      </div>
      {f.note && (
        <div className="mt-16 flex flex-col gap-3 rounded-[14px] border border-water/40 bg-water/[0.06] p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[56ch] text-[17px] text-ink">{f.note[lang]}</p>
          <span className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold tabular-nums text-water">{PHONE_DISPLAY}</span>
        </div>
      )}
    </section>
  );
}

function ChecklistFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "checklist" }> }) {
  return (
    <section className="relative mx-auto grid max-w-[1240px] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-36">
      <div>
        <h2 className={H2}>{f.title[lang]}</h2>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
        <ul className="mt-10 space-y-3">
          {f.items.map((x, i) => (
            <Rise key={i} reduced={reduced} delay={i * 0.12}>
              <li className="grid grid-cols-[2.75rem_1fr] gap-4 rounded-[14px] border border-line bg-night-2/60 p-5">
                <motion.span
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-water text-night"
                  initial={reduced ? false : { scale: 0, rotate: -40 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.25 + i * 0.12 }}
                >
                  <Check size={22} weight="bold" />
                </motion.span>
                <span>
                  <span className="block font-display text-[22px] font-semibold uppercase leading-tight">{x.label[lang]}</span>
                  <span className="mt-1 block text-[16px] leading-snug text-ink-2">
                    “{x.quote}” <span className="text-[13px] text-ink-3">{source}</span>
                  </span>
                </span>
              </li>
            </Rise>
          ))}
        </ul>
      </div>
      <Rise reduced={reduced}>
        <img src={f.img} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-[14px] border border-line object-cover" />
      </Rise>
    </section>
  );
}

function PromiseFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "promise" }> }) {
  return (
    <section className="relative overflow-hidden py-24 lg:py-36">
      <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div>
          <motion.span
            className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-water text-water"
            initial={reduced ? false : { rotate: -180, opacity: 0 }}
            whileInView={{ rotate: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: EASE }}
          >
            <ArrowsClockwise size={30} weight="bold" />
          </motion.span>
          <h2 className={`${H2} mt-8`}>{f.title[lang]}</h2>
          <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
          <div className="mt-10 rounded-[14px] border border-line bg-panel/70 p-7">
            <Quotes size={30} weight="fill" className="text-water" />
            <p className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-semibold uppercase leading-[1.02]">{f.quote}</p>
            <p className="mt-3 text-[13px] text-ink-3">{source}</p>
          </div>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {f.points.map((x, i) => (
              <Rise key={i} reduced={reduced} delay={i * 0.08}>
                <li className="h-full border-t-2 border-water pt-3 text-[16px] leading-snug text-ink-2">{x[lang]}</li>
              </Rise>
            ))}
          </ul>
        </div>
        <Rise reduced={reduced}>
          <img src={f.img} alt="" loading="lazy" className="aspect-[4/5] w-full rounded-[14px] border border-line object-cover" />
        </Rise>
      </div>
    </section>
  );
}

function SlotsFeature({ f, lang, reduced }: P & { f: Extract<Feature, { kind: "slots" }> }) {
  return (
    <section className="relative mx-auto max-w-[1240px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
        <h2 className={H2}>{f.title[lang]}</h2>
        <p className="max-w-[46ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {f.slots.map((s, i) => (
          <Rise key={i} reduced={reduced} delay={i * 0.08} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <div className={`flex h-full flex-col items-center justify-center gap-3 rounded-[14px] border-2 border-dashed border-ink-3/40 bg-night-2/50 p-6 text-center ${i === 0 ? "aspect-square" : "aspect-[4/3] lg:aspect-auto lg:min-h-[210px]"}`}>
              <Camera size={i === 0 ? 44 : 30} className="text-water" />
              <span className="max-w-[22ch] text-[15px] leading-snug text-ink-2">{s[lang]}</span>
            </div>
          </Rise>
        ))}
      </div>
    </section>
  );
}

function PanelsFeature({ f, lang, reduced, source }: P & { f: Extract<Feature, { kind: "panels" }> }) {
  return (
    <section className="relative mx-auto max-w-[1400px] px-4 py-24 sm:px-8 lg:py-36">
      <div className="mx-auto max-w-[1240px]">
        <h2 className={`${H2} max-w-[18ch]`}>{f.title[lang]}</h2>
        <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-2">{f.body[lang]}</p>
      </div>
      <div className="mt-14 grid gap-4 lg:grid-cols-3">
        {f.panels.map((p, i) => (
          <Rise key={i} reduced={reduced} delay={i * 0.1}>
            <figure className="group relative overflow-hidden rounded-[14px] border border-line">
              <img src={p.img} alt={p.label[lang]} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-[10px] bg-night/90 p-5 backdrop-blur-sm">
                <span className="block font-display text-[clamp(1.8rem,3vw,2.4rem)] font-semibold uppercase leading-none">{p.label[lang]}</span>
                <span className="mt-2 block text-[16px] leading-snug text-ink-2">{p.body[lang]}</span>
              </figcaption>
            </figure>
          </Rise>
        ))}
      </div>
      <Quote text={f.quote} source={source} className="mx-auto mt-14 max-w-[1240px]" />
    </section>
  );
}

export function FeatureSection(p: P) {
  const f = FEATURE;
  if (!f) return null;
  switch (f.kind) {
    case "clock":
      return <ClockFeature f={f} {...p} />;
    case "compare":
      return <CompareFeature f={f} {...p} />;
    case "timeline":
      return <TimelineFeature f={f} {...p} />;
    case "tracks":
      return <TracksFeature f={f} {...p} />;
    case "checklist":
      return <ChecklistFeature f={f} {...p} />;
    case "promise":
      return <PromiseFeature f={f} {...p} />;
    case "slots":
      return <SlotsFeature f={f} {...p} />;
    case "panels":
      return <PanelsFeature f={f} {...p} />;
  }
}
