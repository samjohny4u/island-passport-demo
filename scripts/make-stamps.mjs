// Draws the six rubber-stamp SVGs into public/stamps. Run: node scripts/make-stamps.mjs
// Every stamp is original line art; the worn-ink look comes from an SVG filter
// baked into each file, so the browser rasterises it once as an image.
import { writeFileSync, readFileSync } from "node:fs";

const places = JSON.parse(readFileSync(new URL("../data/places.json", import.meta.url)));
const ink = Object.fromEntries(places.map((p) => [p.id, p.ink]));

const FONT = `font-family="'Arial Narrow','Roboto Condensed','Helvetica Neue',Arial,sans-serif" font-weight="700"`;

const wrap = (id, body, seed) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
<defs>
  <filter id="worn" x="-5%" y="-5%" width="110%" height="110%">
    <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="${seed}" result="warp"/>
    <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.2" xChannelSelector="R" yChannelSelector="G" result="rough"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="${seed + 7}" result="grain"/>
    <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.9" result="speckle"/>
    <feComposite in="rough" in2="speckle" operator="in"/>
  </filter>
  <path id="top" d="M 30 100 A 70 70 0 0 1 170 100"/>
  <path id="bot" d="M 26 100 A 74 74 0 0 0 174 100"/>
</defs>
<g filter="url(#worn)" fill="none" stroke="${ink[id]}" color="${ink[id]}" opacity="0.92">
${body}
</g>
</svg>
`;

const arcText = (top, bottom, size = 15) => `
  <text ${FONT} font-size="${size}" letter-spacing="2.4" fill="currentColor" stroke="none" text-anchor="middle"><textPath href="#top" startOffset="50%">${top}</textPath></text>
  <text ${FONT} font-size="${size - 2}" letter-spacing="2.2" fill="currentColor" stroke="none" text-anchor="middle" dominant-baseline="hanging"><textPath href="#bot" startOffset="50%">${bottom}</textPath></text>`;

const label = (x, y, txt, size = 14, ls = 1.6) =>
  `<text x="${x}" y="${y}" ${FONT} font-size="${size}" letter-spacing="${ls}" fill="currentColor" stroke="none" text-anchor="middle">${txt}</text>`;

const stamps = {
  "chocolate-hills": [
    `<circle cx="100" cy="100" r="93" stroke-width="6"/>
  <circle cx="100" cy="100" r="80" stroke-width="1.8"/>
  ${arcText("CHOCOLATE HILLS", "CARMEN · BOHOL")}
  <circle cx="100" cy="100" r="52" stroke-width="2.4"/>
  <path d="M52 118 Q66 82 82 114 Q96 70 116 112 Q130 86 148 118 Z" fill="currentColor" stroke="none"/>
  <path d="M50 124 H150" stroke-width="3"/>
  <path d="M58 131 H142" stroke-width="1.6" stroke-dasharray="5 4"/>
  <circle cx="124" cy="76" r="7" stroke-width="2.4"/>`,
    3,
  ],
  tarsier: [
    `<rect x="12" y="26" width="176" height="148" rx="26" stroke-width="6"/>
  <rect x="22" y="36" width="156" height="128" rx="18" stroke-width="1.8"/>
  ${label(100, 58, "TARSIER", 17, 4)}
  <path d="M64 92 L52 70 L76 84 M136 92 L148 70 L124 84" stroke-width="3" stroke-linejoin="round"/>
  <ellipse cx="100" cy="108" rx="40" ry="34" stroke-width="3"/>
  <circle cx="84" cy="104" r="14" fill="currentColor" stroke="none"/>
  <circle cx="116" cy="104" r="14" fill="currentColor" stroke="none"/>
  <circle cx="87" cy="101" r="4.5" fill="#EEF1E6" stroke="none"/>
  <circle cx="119" cy="101" r="4.5" fill="#EEF1E6" stroke="none"/>
  <path d="M96 124 Q100 128 104 124" stroke-width="2.4" stroke-linecap="round"/>
  ${label(100, 158, "CORELLA · SANCTUARY", 11, 1.8)}`,
    11,
  ],
  "loboc-river": [
    `<path d="M24 22 H176 L184 30 V170 L176 178 H24 L16 170 V30 Z" stroke-width="6" stroke-linejoin="round"/>
  <path d="M30 34 H170 V166 H30 Z" stroke-width="1.6" stroke-dasharray="6 4"/>
  ${label(100, 60, "LOBOC RIVER", 18, 2.6)}
  <path d="M62 112 L100 92 L138 112" stroke-width="3" stroke-linejoin="round"/>
  <path d="M66 112 V124 M134 112 V124" stroke-width="2.6"/>
  <rect x="54" y="124" width="92" height="9" fill="currentColor" stroke="none"/>
  <path d="M40 142 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0 t20 0" stroke-width="2.6"/>
  <path d="M48 152 q10 -7 20 0 t20 0 t20 0 t20 0 t20 0" stroke-width="2"/>
  ${label(100, 166, "BAMBOO RAFT", 10, 2)}`,
    17,
  ],
  "baclayon-church": [
    `<path d="M100 6 L166 34 L194 100 L166 166 L100 194 L34 166 L6 100 L34 34 Z" stroke-width="6" stroke-linejoin="round"/>
  <path d="M100 20 L156 44 L180 100 L156 156 L100 180 L44 156 L20 100 L44 44 Z" stroke-width="1.6"/>
  ${label(100, 54, "BACLAYON", 16, 3)}
  <path d="M62 140 V96 L92 74 L122 96 V140 Z" stroke-width="3" stroke-linejoin="round"/>
  <path d="M82 140 V116 Q92 102 102 116 V140" fill="currentColor" stroke="none"/>
  <circle cx="92" cy="92" r="5" stroke-width="2.2"/>
  <path d="M122 140 V82 H144 V140 M122 82 L133 68 L144 82" stroke-width="3" stroke-linejoin="round"/>
  <rect x="128" y="92" width="10" height="12" rx="5" fill="currentColor" stroke="none"/>
  <path d="M52 140 H154" stroke-width="3"/>
  ${label(100, 160, "EST. 1727", 12, 2.4)}`,
    23,
  ],
  "alona-beach": [
    `<path d="${scallop(100, 100, 92, 84, 28)}" stroke-width="5" stroke-linejoin="round"/>
  <circle cx="100" cy="100" r="70" stroke-width="1.8"/>
  ${label(100, 62, "ALONA BEACH", 15, 2.4)}
  <path d="M70 118 A26 26 0 0 1 122 118 Z" fill="currentColor" stroke="none"/>
  <path d="M96 84 V76 M78 92 L72 86 M114 92 L120 86" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M134 128 Q128 102 136 82" stroke-width="3" stroke-linecap="round"/>
  <path d="M136 82 Q122 74 114 82 M136 82 Q150 72 158 80 M136 82 Q132 68 140 62 M136 82 Q146 88 150 98" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M56 130 q9 -6 18 0 t18 0 t18 0 t18 0 t18 0 t18 0" stroke-width="2.6"/>
  ${label(100, 152, "PANGLAO", 12, 3)}`,
    29,
  ],
  "bilar-forest": [
    `<circle cx="100" cy="100" r="93" stroke-width="3"/>
  <circle cx="100" cy="100" r="86" stroke-width="6" stroke-dasharray="2 5"/>
  <circle cx="100" cy="100" r="76" stroke-width="1.8"/>
  ${arcText("BILAR", "MAHOGANY FOREST", 16)}
  ${trees()}
  <path d="M92 146 L98 112 H102 L108 146" fill="currentColor" stroke="none"/>
  <path d="M52 146 H148" stroke-width="3"/>`,
    37,
  ],
};

function scallop(cx, cy, rOut, rIn, n) {
  let d = "";
  for (let i = 0; i <= n * 2; i++) {
    const a = (Math.PI * i) / n - Math.PI / 2;
    const r = i % 2 ? rIn : rOut;
    d += `${i ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return d + "Z";
}

function trees() {
  const xs = [58, 74, 126, 142];
  return xs
    .map((x, i) => {
      const h = i === 0 || i === 3 ? 44 : 56;
      const top = 146 - h - 10;
      return `<path d="M${x} ${top} C${x + 12} ${top + 14} ${x + 11} ${top + h - 8} ${x} ${top + h} C${x - 11} ${top + h - 8} ${x - 12} ${top + 14} ${x} ${top} Z" fill="currentColor" stroke="none"/>
  <path d="M${x} ${top + h} V146" stroke-width="2.6"/>`;
    })
    .join("\n  ");
}

for (const [id, [body, seed]] of Object.entries(stamps)) {
  writeFileSync(new URL(`../public/stamps/${id}.svg`, import.meta.url), wrap(id, body, seed));
}
console.log("stamps:", Object.keys(stamps).join(", "));
