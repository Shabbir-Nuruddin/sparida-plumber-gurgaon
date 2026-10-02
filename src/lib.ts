export type Lang = "en" | "hi";
export type Bi = { en: string; hi: string };
export type Area = { id: string; en: string; hi: string; lat: number; lon: number };
export type SectionKey = "feature" | "map" | "work" | "reviews" | "visit";
export type Scene = "leak" | "spark";
/** Opening hours per weekday, Sunday first, as [open, close] in decimal hours; null means open 24 hours. */
export type Hours = null | "unknown" | [number, number][];

export type Feature =
  | { kind: "clock"; minutes: number; title: Bi; body: Bi; moments: { when: Bi; quote: string }[] }
  | { kind: "compare"; title: Bi; body: Bi; left: Bi; right: Bi; rows: { label: Bi; left: Bi; right: Bi }[]; quote: string }
  | { kind: "timeline"; layout: "rail" | "stack"; title: Bi; body: Bi; steps: { label: Bi; body: Bi; img?: string }[]; quote: string; img?: string; imgCaption?: Bi }
  | { kind: "tracks"; title: Bi; body: Bi; tracks: { label: Bi; img: string; body: Bi; quote: string }[]; note?: Bi }
  | { kind: "checklist"; title: Bi; body: Bi; items: { label: Bi; quote: string }[]; img: string }
  | { kind: "promise"; title: Bi; body: Bi; quote: string; points: Bi[]; img: string }
  | { kind: "slots"; title: Bi; body: Bi; slots: Bi[] }
  | { kind: "panels"; title: Bi; body: Bi; panels: { img: string; label: Bi; body: Bi }[]; quote: string };

export const bi = (b: Bi, lang: Lang) => b[lang];

/** Approximate area centres across Gurugram, used only for straight-line distance from a shop. */
const POOL: Area[] = [
  { id: "s52", en: "Sector 52", hi: "सेक्टर 52", lat: 28.4352, lon: 77.0805 },
  { id: "s54", en: "Golf Course Rd", hi: "गोल्फ़ कोर्स रोड", lat: 28.4405, lon: 77.1012 },
  { id: "s43", en: "Sector 43", hi: "सेक्टर 43", lat: 28.4562, lon: 77.0893 },
  { id: "dlf5", en: "DLF Phase 5", hi: "DLF फ़ेज़ 5", lat: 28.4497, lon: 77.0995 },
  { id: "sl1", en: "Sushant Lok 1", hi: "सुशांत लोक 1", lat: 28.4636, lon: 77.0771 },
  { id: "s57", en: "Sector 57", hi: "सेक्टर 57", lat: 28.4218, lon: 77.0762 },
  { id: "s56", en: "Sector 56", hi: "सेक्टर 56", lat: 28.4212, lon: 77.1004 },
  { id: "dlf1", en: "DLF Phase 1", hi: "DLF फ़ेज़ 1", lat: 28.4716, lon: 77.0962 },
  { id: "dlf2", en: "DLF Phase 2", hi: "DLF फ़ेज़ 2", lat: 28.488, lon: 77.087 },
  { id: "dlf3", en: "DLF Phase 3", hi: "DLF फ़ेज़ 3", lat: 28.4928, lon: 77.0957 },
  { id: "dlf4", en: "DLF Phase 4", hi: "DLF फ़ेज़ 4", lat: 28.469, lon: 77.082 },
  { id: "s65", en: "Golf Course Ext.", hi: "गोल्फ़ कोर्स एक्सटेंशन", lat: 28.4025, lon: 77.0745 },
  { id: "s62", en: "Sector 62", hi: "सेक्टर 62", lat: 28.406, lon: 77.091 },
  { id: "mg", en: "MG Road", hi: "एमजी रोड", lat: 28.48, lon: 77.08 },
  { id: "cyber", en: "Cyber City", hi: "साइबर सिटी", lat: 28.495, lon: 77.089 },
  { id: "s38", en: "Sector 38", hi: "सेक्टर 38", lat: 28.4316, lon: 77.0405 },
  { id: "medi", en: "Medicity", hi: "मेडिसिटी", lat: 28.4395, lon: 77.0408 },
  { id: "s39", en: "Sector 39", hi: "सेक्टर 39", lat: 28.4455, lon: 77.056 },
  { id: "s40", en: "Sector 40", hi: "सेक्टर 40", lat: 28.452, lon: 77.054 },
  { id: "s45", en: "Sector 45", hi: "सेक्टर 45", lat: 28.444, lon: 77.068 },
  { id: "s46", en: "Sector 46", hi: "सेक्टर 46", lat: 28.434, lon: 77.059 },
  { id: "s47", en: "Sector 47", hi: "सेक्टर 47", lat: 28.423, lon: 77.05 },
  { id: "sohna", en: "Sohna Road", hi: "सोहना रोड", lat: 28.413, lon: 77.043 },
  { id: "s50", en: "Nirvana, Sec 50", hi: "निर्वाणा, सेक्टर 50", lat: 28.418, lon: 77.064 },
  { id: "s31", en: "Sector 31", hi: "सेक्टर 31", lat: 28.456, lon: 77.045 },
  { id: "s14", en: "Sector 14", hi: "सेक्टर 14", lat: 28.473, lon: 77.045 },
  { id: "pv", en: "Palam Vihar", hi: "पालम विहार", lat: 28.5085, lon: 77.0395 },
  { id: "npv", en: "New Palam Vihar", hi: "न्यू पालम विहार", lat: 28.501, lon: 77.012 },
  { id: "s23", en: "Sector 23", hi: "सेक्टर 23", lat: 28.5115, lon: 77.059 },
  { id: "dwarka", en: "Dwarka Expressway", hi: "द्वारका एक्सप्रेसवे", lat: 28.5, lon: 77.005 },
  { id: "s9", en: "Sector 9", hi: "सेक्टर 9", lat: 28.471, lon: 77.018 },
];

export const pickAreas = (ids: string[]) => ids.map((id) => POOL.find((a) => a.id === id)!);

export function km(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const r = (d: number) => (d * Math.PI) / 180;
  const dLat = r(b.lat - a.lat);
  const dLon = r(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const fmtHour = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""}${hh < 12 ? "AM" : "PM"}`;
};

/** The second split-flap line: live open or closed state in IST, at most 15 characters. */
export function hoursFlap(hours: Hours, idle: string, now: Date, clock: string): { text: string; label: string } {
  if (hours === null) return { text: `OPEN 24X7 ${clock}`, label: `Open 24x7, ${clock} IST` };
  if (hours === "unknown") return { text: idle, label: idle };
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day = ist.getDay();
  const t = ist.getHours() + ist.getMinutes() / 60;
  const [o, c] = hours[day];
  if (t >= o && t < c) {
    const s = `OPEN TILL ${fmtHour(c)}`;
    return { text: s.length <= 15 ? s : `OPEN TIL ${fmtHour(c)}`, label: `Open now, till ${fmtHour(c)}` };
  }
  const next = t < o ? hours[day][0] : hours[(day + 1) % 7][0];
  return { text: `OPENS AT ${fmtHour(next)}`, label: `Closed now, opens at ${fmtHour(next)}` };
}
