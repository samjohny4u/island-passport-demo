// MapLibre 6 runs its tile worker from a separate module file. Turbopack does not
// emit it, so copy it (and the chunk it shares) into public/ before dev and build.
import { copyFileSync, mkdirSync } from "node:fs";
const src = new URL("../node_modules/maplibre-gl/dist/", import.meta.url);
const out = new URL("../public/maplibre/", import.meta.url);
mkdirSync(out, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(new URL(f, src), new URL(f, out));
console.log("maplibre worker copied");
