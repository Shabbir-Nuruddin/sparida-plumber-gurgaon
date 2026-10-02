import { Component, Fragment, Suspense, lazy, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { MapPin, Phone, Star, WhatsappLogo, Clock, CreditCard, NavigationArrow } from "@phosphor-icons/react";
import { BRAND, COPY, FALLBACK_IMG, FLAP_IDLE, HOURS, MAPS_URL, ORDER, PHONE, PHONE_DISPLAY, RATINGS, REVIEWS, SCENE, STATUSES, VISIT_ALT, VISIT_IMG, waLink } from "./content";
import { hoursFlap, type Lang, type SectionKey } from "./lib";
import { SplitFlapRow } from "./components/SplitFlap";
import { LangToggle } from "./components/LangToggle";
import { DispatchMap } from "./components/DispatchMap";
import { FeatureSection } from "./components/Feature";

const PipeScene = lazy(() => import("./components/PipeScene"));
const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL = RATINGS.reduce((s, r) => s + r.count, 0);

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed)
      return <img src={FALLBACK_IMG} alt="" className="h-full w-full object-cover opacity-40 md:ml-auto md:w-2/3" />;
    return this.props.children;
  }
}

function useIstClock() {
  const fmt = useMemo(() => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }), []);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);
  return { now, clock: fmt.format(now) };
}

function useDevice() {
  return useMemo(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const narrow = window.innerWidth < 768;
    const lite = narrow || (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const fine = window.matchMedia("(pointer: fine)").matches;
    return { lite, fine };
  }, []);
}

export function CallButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <a
      href={`tel:${PHONE}`}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full bg-water px-6 py-3.5 text-[16px] font-semibold text-night shadow-[0_10px_30px_-10px_rgb(66_198_255/0.6)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] ${className}`}
    >
      <Phone size={19} weight="fill" />
      {label}
    </a>
  );
}

export function WaButton({ label, text, className = "" }: { label: string; text: string; className?: string }) {
  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center justify-center gap-2.5 rounded-full border border-wa/50 px-6 py-3.5 text-[16px] font-semibold text-ink transition-colors duration-200 hover:bg-wa hover:text-[#062a14] active:scale-[0.98] ${className}`}
    >
      <WhatsappLogo size={20} weight="fill" className="text-wa [a:hover_&]:text-[#062a14]" />
      {label}
    </a>
  );
}

export function Slip({ quote, source, className = "" }: { quote: string; source: string; className?: string }) {
  return (
    <figure className={`rounded-[14px] border border-line bg-panel/80 p-5 backdrop-blur-sm ${className}`}>
      <div className="flex items-center gap-1 text-water" aria-label="5 stars">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={14} weight="fill" />
        ))}
      </div>
      <blockquote className="mt-3 text-[17px] leading-snug text-ink">“{quote}”</blockquote>
      <figcaption className="mt-3 border-t border-dashed border-line pt-3 text-[13px] text-ink-3">{source}</figcaption>
    </figure>
  );
}

/** Bento spans for any number of service tiles on the 12 column grid. */
const SPAN_ROWS: Record<number, string[]> = {
  1: ["lg:col-span-12"],
  2: ["lg:col-span-7", "lg:col-span-5"],
  3: ["lg:col-span-4", "lg:col-span-4", "lg:col-span-4"],
};
function spans(n: number) {
  const out: string[] = [];
  let left = n;
  let flip = false;
  while (left > 0) {
    const take = left === 4 ? 2 : left === 5 ? 2 : Math.min(3, left);
    const row = take === 2 && flip ? ["lg:col-span-5", "lg:col-span-7"] : SPAN_ROWS[take];
    if (take === 2) flip = !flip;
    out.push(...row);
    left -= take;
  }
  return out;
}

export default function App() {
  const [lang, setLang] = useState<Lang>("en");
  const t = COPY[lang];
  const reduced = (useReducedMotion() ?? false) && !new URLSearchParams(location.search).has("motion");
  const { lite, fine } = useDevice();
  const { now, clock } = useIstClock();
  const flap = hoursFlap(HOURS, FLAP_IDLE, now, clock);
  const stage = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ["start start", "end end"] });
  const [beat, setBeat] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const b = Math.min(3, Math.floor(v * 4.0001));
    if (b !== beat) setBeat(b);
  });

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const enter = reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(10px)" };
  const leave = reduced ? { opacity: 0 } : { opacity: 0, y: -16, filter: "blur(10px)" };
  const serviceSpans = spans(t.services.length);
  const pct = (n: number) => `${(n / TOTAL) * 100}%`;

  const sections: Record<SectionKey, ReactNode> = {
    feature: <FeatureSection lang={lang} reduced={reduced} source={t.googleReview} />,
    map: <DispatchMap lang={lang} t={t} />,
    work: (
      <section className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:py-32">
        <h2 className="max-w-[18ch] font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold uppercase leading-[0.95] text-balance">{t.workTitle}</h2>
        <p className="mt-4 max-w-[60ch] text-lg text-ink-2">{t.workBody}</p>
        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-12">
          {t.services.map((s, i) => {
            const span = serviceSpans[i];
            const tall = !span.endsWith("-4");
            return (
              <motion.figure
                key={s.img}
                className={span}
                initial={reduced ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, ease: EASE, delay: (i % 3) * 0.06 }}
              >
                <div className="group overflow-hidden rounded-[14px] border border-line bg-night-2">
                  <img
                    src={s.img}
                    alt={s.title}
                    loading="lazy"
                    className={`w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${tall ? "aspect-[4/3] lg:aspect-auto lg:h-[440px]" : "aspect-[4/3] lg:aspect-auto lg:h-[340px]"}`}
                  />
                </div>
                <figcaption className="mt-4 flex flex-col gap-1">
                  <span className="font-display text-[24px] font-semibold uppercase leading-tight">{s.title}</span>
                  <span className="max-w-[48ch] text-[16px] leading-relaxed text-ink-2">{s.body}</span>
                </figcaption>
              </motion.figure>
            );
          })}
        </div>
      </section>
    ),
    reviews: (
      <section className="relative py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-4 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold uppercase leading-[0.95] text-balance">{t.revTitle}</h2>
          <div>
            <ul className="space-y-2" aria-label="Google rating breakdown">
              {RATINGS.map((r) => (
                <li key={r.stars} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-3 text-[15px]">
                  <span className="inline-flex items-center gap-1 text-ink-2 tabular-nums">
                    {r.stars} <Star size={13} weight="fill" className="text-water" aria-label={t.stars} />
                  </span>
                  <span className="h-2 overflow-hidden rounded-full bg-night-2">
                    <motion.span
                      className="block h-full rounded-full bg-water"
                      initial={reduced ? false : { width: 0 }}
                      whileInView={{ width: pct(r.count) }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: EASE }}
                      style={reduced ? { width: pct(r.count) } : undefined}
                    />
                  </span>
                  <span className="text-right text-ink-2 tabular-nums">{r.count}</span>
                </li>
              ))}
            </ul>
            {t.tags.length > 0 && (
              <>
                <p className="mt-6 text-[14px] text-ink-3">{t.revTags}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {t.tags.map((g) => (
                    <li key={g.label} className="rounded-full border border-line px-3.5 py-1.5 text-[14px] text-ink-2">
                      {g.label} <span className="text-ink tabular-nums">{g.n}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="marquee mt-16 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max gap-4">
            {[...REVIEWS, ...REVIEWS].map((q, i) => (
              <Slip key={i} quote={q} source={t.googleReview} className="w-[320px] shrink-0 sm:w-[360px]" />
            ))}
          </div>
        </div>
      </section>
    ),
    visit: (
      <section className="relative mx-auto grid max-w-[1240px] gap-10 px-4 pb-32 pt-12 sm:px-8 lg:grid-cols-2 lg:items-center lg:pb-40">
        <div className="overflow-hidden rounded-[14px] border border-line">
          <img src={VISIT_IMG} alt={VISIT_ALT} loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </div>
        <div>
          <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-semibold uppercase leading-[0.95]">{t.visitTitle}</h2>
          <a href={`tel:${PHONE}`} className="mt-6 block font-display text-[clamp(3rem,8vw,5.5rem)] font-bold leading-none tabular-nums text-water hover:underline">
            {PHONE_DISPLAY}
          </a>
          <ul className="mt-8 space-y-4 text-[17px] text-ink-2">
            <li className="flex gap-3">
              <MapPin size={22} className="mt-0.5 shrink-0 text-water" />
              {t.address}
            </li>
            <li className="flex gap-3">
              <Clock size={22} className="mt-0.5 shrink-0 text-water" />
              {t.hours}
            </li>
            {t.pay && (
              <li className="flex gap-3">
                <CreditCard size={22} className="mt-0.5 shrink-0 text-water" />
                {t.pay}
              </li>
            )}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <CallButton label={t.call} />
            <WaButton label={t.whatsapp} text={t.waHello} />
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-[16px] font-semibold text-ink-2 transition-colors hover:border-water/60 hover:text-ink"
            >
              <NavigationArrow size={18} weight="fill" />
              {t.directions}
            </a>
          </div>
        </div>
      </section>
    ),
  };

  return (
    <div className="relative">
      {/* header */}
      <header className="fixed inset-x-0 top-0 z-40">
        <p className="bg-water px-4 py-1.5 text-center text-[13px] font-medium text-night">{t.banner}</p>
        <div className="border-b border-line bg-night/90">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
            <a href="#top" className="min-w-0 leading-none">
              <span className="block truncate font-display text-[26px] font-bold uppercase tracking-[0.02em] text-ink">{BRAND}</span>
              <span className="block truncate text-[13px] text-ink-2">{t.brandSub}</span>
            </a>
            <div className="flex shrink-0 items-center gap-3">
              <LangToggle value={lang} onChange={setLang} label={t.langLabel} />
              <span className="hidden md:contents">
                <CallButton label={t.call} className="!px-5 !py-2.5 !text-[15px]" />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* dispatch stage: hero plus the three story beats share one sticky field */}
      <section id="top" ref={stage} className="relative h-[420svh]">
        <div className="sticky top-0 h-[100dvh] overflow-hidden">
          <div className="field absolute inset-0" />
          <div className="absolute inset-0">
            <SceneBoundary>
              <Suspense fallback={null}>
                <PipeScene progress={scrollYProgress} lite={lite} interactive={fine && !reduced} still={reduced} mode={SCENE} />
              </Suspense>
            </SceneBoundary>
          </div>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--color-night)_18%,transparent_62%)] md:bg-[linear-gradient(to_right,var(--color-night)_22%,transparent_60%)]" />

          <div className="pointer-events-none relative mx-auto flex h-full max-w-[1400px] flex-col justify-end px-4 pb-28 sm:px-8 md:justify-center md:pb-0 md:pt-20">
            <div className="pointer-events-auto max-w-[560px] [--cw:min(26px,calc((100vw-2rem-42px)/15))]">
              <div className="mb-3 flex w-fit items-center gap-2.5 rounded-full border border-line bg-night/80 px-3 py-1 text-[14px] text-ink-2">
                <span className="live-dot relative inline-block h-2 w-2 rounded-full bg-water text-water" />
                {t.live}
              </div>
              <div className="inline-flex flex-col gap-[5px] rounded-[10px] border border-line bg-night/70 p-2.5 backdrop-blur-sm">
                <SplitFlapRow text={STATUSES[beat]} columns={15} />
                <SplitFlapRow text={flap.text} columns={15} label={flap.label} />
              </div>

              <div className="relative mt-7 min-h-[300px] md:min-h-[330px]">
                <AnimatePresence mode="wait" initial={false}>
                  {beat === 0 ? (
                    <motion.div key={`hero-${lang}`} initial={enter} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={leave} transition={{ duration: 0.55, ease: EASE }}>
                      <h1 className="font-display text-[clamp(2.9rem,7vw,5.6rem)] font-bold uppercase leading-[0.9] tracking-[-0.01em] text-balance">
                        {t.heroTitle[0]}
                        <br />
                        <span className="text-water">{t.heroTitle[1]}</span>
                      </h1>
                      <p className="mt-5 max-w-[40ch] text-[18px] leading-relaxed text-ink-2">{t.heroProof}</p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <CallButton label={t.call} />
                        <WaButton label={t.whatsapp} text={t.waHello} />
                      </div>
                      {fine && <p className="mt-6 hidden text-[13px] text-ink-3 md:block">{t.drag}</p>}
                    </motion.div>
                  ) : (
                    <motion.div key={`beat-${beat}-${lang}`} initial={enter} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={leave} transition={{ duration: 0.55, ease: EASE }}>
                      <h2 className="font-display text-[clamp(2.5rem,6vw,4.8rem)] font-bold uppercase leading-[0.92] tracking-[-0.01em] text-balance">{t.beats[beat - 1].title}</h2>
                      <p className="mt-4 max-w-[42ch] text-[18px] leading-relaxed text-ink-2">{t.beats[beat - 1].body}</p>
                      <Slip quote={t.beats[beat - 1].quote} source={t.googleReview} className="mt-6 max-w-[400px]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* route rail: where the job is */}
          <ol className="absolute bottom-24 right-4 hidden flex-col gap-3 text-right md:bottom-10 md:right-8 md:flex" aria-label="Job status">
            {STATUSES.map((s, i) => (
              <li key={s} className={`flex items-center justify-end gap-3 font-display text-[15px] font-semibold uppercase tracking-[0.06em] transition-colors duration-500 ${i <= beat ? "text-ink" : "text-ink-3/60"}`}>
                {s}
                <span className={`h-2.5 w-2.5 rounded-full border transition-colors duration-500 ${i <= beat ? "border-water bg-water" : "border-ink-3/60"}`} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="relative">
        <div className="field pointer-events-none absolute inset-0 opacity-60" />
        {ORDER.map((k) => (
          <Fragment key={k}>{sections[k]}</Fragment>
        ))}
        <footer className="relative border-t border-line px-4 pb-28 pt-8 text-center text-[13px] text-ink-3 sm:px-8 md:pb-10">{t.footer}</footer>
      </div>

      {/* desktop floating WhatsApp */}
      <a
        href={waLink(t.waHello)}
        target="_blank"
        rel="noreferrer"
        aria-label={t.whatsapp}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-wa text-[#062a14] shadow-[0_12px_30px_-8px_rgb(37_211_102/0.55)] transition-transform hover:-translate-y-1 md:flex"
      >
        <WhatsappLogo size={28} weight="fill" />
      </a>

      {/* mobile thumb bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1.4fr_1fr] gap-2 border-t border-line bg-night/90 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
        <CallButton label={t.callShort} className="whitespace-nowrap !px-4 !py-3" />
        <a href={waLink(t.waHello)} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-wa py-3 text-[16px] font-semibold text-[#062a14] active:scale-[0.98]">
          <WhatsappLogo size={20} weight="fill" />
          {t.whatsapp}
        </a>
      </div>
    </div>
  );
}
