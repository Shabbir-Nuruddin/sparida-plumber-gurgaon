import { pickAreas, type Feature, type Hours, type Scene, type SectionKey } from "./lib";

export const BRAND = "S. Parida";
export const HOURS: Hours = [[8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [8, 20], [8, 20]];
export const FLAP_IDLE = "";
export const SCENE: Scene = "leak";
export const VISIT_IMG = "/img/p2.jpg";
export const VISIT_ALT = "Brass shower set fitted by S. Parida Plumber";
export const FALLBACK_IMG = "/img/p9.jpg";
export const ORDER: SectionKey[] = ["feature", "map", "work", "reviews", "visit"];

export const PHONE = "+917701843215";
export const PHONE_DISPLAY = "77018 43215";
export const WA = "917701843215";
export const SHOP = { lat: 28.4821024, lon: 77.0956533 };
export const MAPS_URL = `https://www.google.com/maps/dir/?api=1&destination=${SHOP.lat},${SHOP.lon}`;

export const waLink = (text: string) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

export const AREAS = pickAreas(["dlf1", "dlf2", "dlf3", "dlf4", "cyber", "mg", "sl1", "s43", "dlf5", "s23"]);
export const DEFAULT_AREA = "dlf2";

/** Verbatim from Google reviews of the listing. */
export const REVIEWS = [
  "Great service and maintain hygiene.",
  "Very clean and quality work",
  "fixed our problem in one visit",
  "Best work, very accurate judgement",
  "Quick and quality service was provided at the time of urgency.",
  "Provided instant support at reasonable rate",
  "Very professional and knowledgeable",
];

export const RATINGS = [
  { stars: 5, count: 105 },
  { stars: 4, count: 0 },
  { stars: 3, count: 0 },
  { stars: 2, count: 0 },
  { stars: 1, count: 2 },
];

export const STATUSES = ["URGENT LEAK", "DIAGNOSED", "ONE VISIT", "FLOOR WIPED"];

export const FEATURE: Feature = {
  kind: "checklist",
  title: { en: "What you can expect when Parida walks in.", hi: "पारिदा जी के आने पर क्या मिलेगा।" },
  body: {
    en: "Not a promise we wrote. Four things his customers already said, in their own words, on Google.",
    hi: "हमारा लिखा वादा नहीं। चार बातें जो उनके ग्राहक गूगल पर अपने शब्दों में लिख चुके हैं।",
  },
  items: [
    { label: { en: "The right diagnosis", hi: "सही पहचान" }, quote: "Best work, very accurate judgement" },
    { label: { en: "Fixed in one visit", hi: "एक बार में ठीक" }, quote: "fixed our problem in one visit" },
    { label: { en: "A clean home after", hi: "काम के बाद साफ़ घर" }, quote: "Great service and maintain hygiene." },
    { label: { en: "A fair bill", hi: "सही बिल" }, quote: "Provided instant support at reasonable rate" },
  ],
  img: "/img/p1.jpg",
};

const en = {
  banner: "Concept preview made for S. Parida Plumber by LocalLift. Not live yet.",
  brandSub: "Plumber, DLF Phase 1",
  live: "Parida ji, 8am to 8pm daily",
  shopLabel: "Parida's shop",
  call: "Call Parida",
  callShort: "Call Parida",
  whatsapp: "WhatsApp",
  waHello: "Namaste Parida ji, I need a plumber.",
  heroTitle: ["One visit.", "Clean floor after."],
  heroProof: "4.9 stars from 107 Google reviews. Nathupur, DLF Phase 1. Open 8am to 8pm daily.",
  drag: "Drag to turn the pipe",
  beats: [
    { title: "It's urgent. He's quick.", body: "From pillar 60 near DLF City Court, across the DLF phases.", quote: REVIEWS[4] },
    { title: "He reads the problem first.", body: "Diverters, mixers, softeners and pumps. Customers mention his judgement as much as his hands.", quote: REVIEWS[3] },
    { title: "And leaves it spotless.", body: "Hygiene is the word customers keep using.", quote: REVIEWS[0] },
  ],
  googleReview: "Google review",
  distTitle: "How close is Parida?",
  distBody: "Pick your area. Straight-line distance from the shop near DLF City Court.",
  distUnit: "km from the shop",
  distAsk: "Ask on WhatsApp",
  distWa: (area: string) => `Namaste Parida ji, I'm in ${area}. Can you come today?`,
  workTitle: "Fittings, fixed right.",
  workBody: "Every photo here is from S. Parida Plumber's own Google listing.",
  services: [
    { img: "/img/p4.jpg", title: "Diverter cartridges", body: "Leaking or stiff diverters opened and replaced." },
    { img: "/img/p9.jpg", title: "Mixers and taps", body: "Tall basin mixers and wall mixers fitted." },
    { img: "/img/p3.jpg", title: "Twin pump setups", body: "Pressure pumps installed and serviced." },
    { img: "/img/p5.jpg", title: "Water softeners", body: "Softener vessels connected and maintained." },
    { img: "/img/p7.jpg", title: "Basins and WCs", body: "Countertop basins, WCs and urinals." },
    { img: "/img/p10.jpg", title: "Shower fittings", body: "Chrome and brass shower sets." },
  ],
  revTitle: "107 reviews. 105 of them five stars.",
  revTags: "What customers mention most on Google",
  tags: [
    { label: "Behaviour", n: 7 },
    { label: "Work", n: 7 },
    { label: "Quick fix", n: 3 },
    { label: "Responsiveness", n: 3 },
  ],
  stars: "stars",
  visitTitle: "Near DLF City Court.",
  address: "Shop No-5, Jagannath Traders, Pillar No-60, near DLF City Court, Nathupur, DLF Phase 1, Sector 24, Gurugram",
  hours: "8am to 8pm, 7 days",
  pay: "",
  directions: "Directions",
  footer: "Concept by LocalLift for S. Parida Plumber, Gurugram. Photos and reviews from the business's Google listing.",
  langLabel: "Language",
};

const hi: typeof en = {
  banner: "यह LocalLift द्वारा S. पारिदा प्लंबर के लिए बनाया गया डेमो है। अभी लाइव नहीं है।",
  brandSub: "प्लंबर, DLF फ़ेज़ 1",
  live: "पारिदा जी, रोज़ सुबह 8 से रात 8",
  shopLabel: "पारिदा जी की दुकान",
  call: "पारिदा जी को कॉल करें",
  callShort: "कॉल करें",
  whatsapp: "व्हाट्सऐप",
  waHello: "नमस्ते पारिदा जी, मुझे प्लंबर चाहिए।",
  heroTitle: ["एक बार में ठीक।", "फ़र्श साफ़।"],
  heroProof: "107 गूगल रिव्यू में 4.9 स्टार। नाथूपुर, DLF फ़ेज़ 1। रोज़ सुबह 8 से रात 8।",
  drag: "पाइप घुमाने के लिए खींचें",
  beats: [
    { title: "जल्दी है? वो जल्दी हैं।", body: "DLF सिटी कोर्ट के पास पिलर 60 से, सभी DLF फ़ेज़ तक।", quote: REVIEWS[4] },
    { title: "पहले समस्या समझते हैं।", body: "डाइवर्टर, मिक्सर, सॉफ़्टनर और पंप। ग्राहक उनकी समझ की तारीफ़ करते हैं।", quote: REVIEWS[3] },
    { title: "और जगह चमकती छोड़ते हैं।", body: "ग्राहक बार बार सफ़ाई की बात लिखते हैं।", quote: REVIEWS[0] },
  ],
  googleReview: "गूगल रिव्यू",
  distTitle: "पारिदा जी कितनी दूर हैं?",
  distBody: "अपना इलाका चुनें। DLF सिटी कोर्ट के पास की दुकान से सीधी दूरी।",
  distUnit: "किमी दुकान से",
  distAsk: "व्हाट्सऐप पर पूछें",
  distWa: (area: string) => `नमस्ते पारिदा जी, मैं ${area} में हूँ। क्या आज आ सकते हैं?`,
  workTitle: "फ़िटिंग, सही तरीके से।",
  workBody: "यहाँ की हर फ़ोटो S. पारिदा प्लंबर की अपनी गूगल लिस्टिंग से है।",
  services: [
    { img: "/img/p4.jpg", title: "डाइवर्टर कार्ट्रिज", body: "टपकते या जाम डाइवर्टर खोलकर बदले।" },
    { img: "/img/p9.jpg", title: "मिक्सर और टोंटी", body: "ऊँचे बेसिन मिक्सर और वॉल मिक्सर।" },
    { img: "/img/p3.jpg", title: "दो पंप वाला सेटअप", body: "प्रेशर पंप लगाए और सर्विस किए।" },
    { img: "/img/p5.jpg", title: "वॉटर सॉफ़्टनर", body: "सॉफ़्टनर कनेक्ट और मेंटेन।" },
    { img: "/img/p7.jpg", title: "बेसिन और WC", body: "काउंटरटॉप बेसिन, WC और यूरिनल।" },
    { img: "/img/p10.jpg", title: "शावर फ़िटिंग", body: "क्रोम और पीतल के शावर सेट।" },
  ],
  revTitle: "107 रिव्यू। 105 पाँच स्टार।",
  revTags: "गूगल पर ग्राहक सबसे ज़्यादा क्या लिखते हैं",
  tags: [
    { label: "व्यवहार", n: 7 },
    { label: "काम", n: 7 },
    { label: "जल्दी ठीक", n: 3 },
    { label: "जवाबदेही", n: 3 },
  ],
  stars: "स्टार",
  visitTitle: "DLF सिटी कोर्ट के पास।",
  address: "शॉप नं-5, जगन्नाथ ट्रेडर्स, पिलर नं-60, DLF सिटी कोर्ट के पास, नाथूपुर, DLF फ़ेज़ 1, सेक्टर 24, गुरुग्राम",
  hours: "सुबह 8 से रात 8, सातों दिन",
  pay: "",
  directions: "रास्ता देखें",
  footer: "LocalLift द्वारा S. पारिदा प्लंबर, गुरुग्राम के लिए कॉन्सेप्ट। फ़ोटो और रिव्यू गूगल लिस्टिंग से।",
  langLabel: "भाषा",
};

export const COPY = { en, hi };
