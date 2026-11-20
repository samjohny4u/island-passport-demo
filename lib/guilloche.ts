// Generates a passport-style guilloche (spirograph rosette) as an SVG data URL.
// Static string, rendered once by the browser as a background image.
function rosette(cx: number, cy: number, R: number, r: number, d: number, turns: number, steps: number) {
  let p = "";
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2 * turns;
    const x = cx + (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
    const y = cy + (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
    p += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return p;
}

function waves(w: number, h: number, rows: number, amp: number) {
  let out = "";
  for (let k = 0; k < rows; k++) {
    const y0 = (h / rows) * k + h / rows / 2;
    let p = "";
    for (let x = 0; x <= w; x += 6) {
      const y = y0 + amp * Math.sin(x / 22 + k * 0.55) * Math.cos(x / 61 - k * 0.3);
      p += `${x ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    out += `<path d="${p}"/>`;
  }
  return out;
}

export function guillocheUrl(stroke: string, opacity = 1) {
  const w = 360,
    h = 520;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><g fill="none" stroke="${stroke}" stroke-width="0.6" opacity="${opacity}">${waves(w, h, 34, 7)}<path d="${rosette(180, 260, 150, 41, 92, 41, 2400)}"/><path d="${rosette(180, 260, 96, 23, 58, 23, 1600)}"/></g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
