import type { StyleSpecification } from "maplibre-gl";

// A hand-built, minimal style over OpenFreeMap's free OpenMapTiles vector tiles.
// Fewer layers than a stock style keeps fly-to smooth on mid-range phones.
export const COLORS = {
  sea: "#8FBFBE",
  seaDeep: "#7AB1B2",
  land: "#E7DDC4",
  wood: "#C9D3A6",
  grass: "#D8DBB2",
  sand: "#EFE6CC",
  road: "#FBF6EA",
  roadCase: "#CDBF9E",
  label: "#3E3A2E",
  waterLabel: "#2E6466",
};

export const mapStyle: StyleSpecification = {
  version: 8,
  glyphs: "https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf",
  sources: {
    omt: { type: "vector", url: "https://tiles.openfreemap.org/planet" },
  },
  layers: [
    { id: "land", type: "background", paint: { "background-color": COLORS.land } },
    {
      id: "wood",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "wood"],
      paint: { "fill-color": COLORS.wood, "fill-opacity": 0.75 },
    },
    {
      id: "grass",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["in", ["get", "class"], ["literal", ["grass", "farmland", "wetland"]]],
      paint: { "fill-color": COLORS.grass, "fill-opacity": 0.6 },
    },
    {
      id: "sand",
      type: "fill",
      source: "omt",
      "source-layer": "landcover",
      filter: ["==", ["get", "class"], "sand"],
      paint: { "fill-color": COLORS.sand },
    },
    {
      id: "water",
      type: "fill",
      source: "omt",
      "source-layer": "water",
      paint: { "fill-color": COLORS.sea },
    },
    {
      id: "water-edge",
      type: "line",
      source: "omt",
      "source-layer": "water",
      paint: { "line-color": COLORS.seaDeep, "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.6, 14, 2] },
    },
    {
      id: "rivers",
      type: "line",
      source: "omt",
      "source-layer": "waterway",
      paint: { "line-color": COLORS.sea, "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.6, 15, 3] },
    },
    {
      id: "roads-case",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 9,
      filter: ["in", ["get", "class"], ["literal", ["primary", "secondary", "tertiary", "trunk"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": COLORS.roadCase, "line-width": ["interpolate", ["linear"], ["zoom"], 9, 1.4, 15, 7] },
    },
    {
      id: "roads",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 9,
      filter: ["in", ["get", "class"], ["literal", ["primary", "secondary", "tertiary", "trunk"]]],
      layout: { "line-cap": "round", "line-join": "round" },
      paint: { "line-color": COLORS.road, "line-width": ["interpolate", ["linear"], ["zoom"], 9, 0.6, 15, 4.5] },
    },
    {
      id: "minor-roads",
      type: "line",
      source: "omt",
      "source-layer": "transportation",
      minzoom: 12,
      filter: ["in", ["get", "class"], ["literal", ["minor", "service"]]],
      paint: { "line-color": COLORS.road, "line-width": ["interpolate", ["linear"], ["zoom"], 12, 0.5, 16, 3] },
    },
    {
      id: "water-names",
      type: "symbol",
      source: "omt",
      "source-layer": "water_name",
      layout: {
        "text-field": ["get", "name:latin"],
        "text-font": ["Noto Sans Italic"],
        "text-size": 12,
        "text-letter-spacing": 0.2,
      },
      paint: { "text-color": COLORS.waterLabel, "text-halo-color": COLORS.sea, "text-halo-width": 1 },
    },
    {
      id: "towns",
      type: "symbol",
      source: "omt",
      "source-layer": "place",
      filter: ["in", ["get", "class"], ["literal", ["city", "town", "village"]]],
      layout: {
        "text-field": ["get", "name:latin"],
        "text-font": ["Noto Sans Regular"],
        "text-size": ["interpolate", ["linear"], ["zoom"], 9, 10, 14, 13],
        "text-letter-spacing": 0.06,
        "text-max-width": 8,
      },
      paint: { "text-color": COLORS.label, "text-halo-color": COLORS.land, "text-halo-width": 1.4 },
    },
  ],
};

export const BOHOL_BOUNDS: [[number, number], [number, number]] = [
  [123.74, 9.53],
  [124.62, 10.18],
];
