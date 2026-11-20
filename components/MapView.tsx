"use client";
import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MLMap, Marker } from "maplibre-gl";

maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
import { BOHOL_BOUNDS, mapStyle } from "@/lib/mapStyle";
import type { Place } from "@/lib/places";

type Props = {
  places: Place[];
  collected: string[];
  activeId: string | null;
  reduced: boolean;
  onPinTap: (id: string) => void;
  onArrive: (id: string) => void;
};

const CHECK =
  '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';

export default function MapView({ places, collected, activeId, reduced, onPinTap, onArrive }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const map = useRef<MLMap | null>(null);
  const markers = useRef<Record<string, { marker: Marker; el: HTMLButtonElement }>>({});
  const flight = useRef(0);
  const cb = useRef({ onPinTap, onArrive });
  cb.current = { onPinTap, onArrive };

  // Create the map once.
  useEffect(() => {
    if (!host.current) return;
    const m = new maplibregl.Map({
      container: host.current,
      style: mapStyle,
      center: [123.95, 10.05],
      zoom: 7.6,
      minZoom: 7,
      maxZoom: 16,
      maxPitch: 60,
      pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      attributionControl: false,
      dragRotate: false,
      pitchWithRotate: false,
      // Keep the first frame cheap; tiles fade in quickly.
      fadeDuration: 200,
    });
    m.touchZoomRotate.disableRotation();
    m.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      "bottom-left",
    );
    map.current = m;

    places.forEach((p, i) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "pin";
      el.style.setProperty("--stamp", p.ink);
      el.style.setProperty("--i", String(i));
      el.setAttribute("aria-label", `${p.name}, ${p.town}`);
      el.innerHTML = `<span class="pin__seal"><span class="pin__dot"></span><span class="pin__check">${CHECK}</span></span><span class="pin__label">${p.name}</span>`;
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        cb.current.onPinTap(p.id);
      });
      const marker = new maplibregl.Marker({ element: el, anchor: "center" }).setLngLat([p.lng, p.lat]).addTo(m);
      markers.current[p.id] = { marker, el };
    });

    m.once("load", () => {
      m.fitBounds(BOHOL_BOUNDS, {
        padding: { top: 90, bottom: 60, left: 24, right: 24 },
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800,
        essential: true,
      });
      host.current?.classList.add("is-ready");
    });

    const ro = new ResizeObserver(() => m.resize());
    ro.observe(host.current);
    return () => {
      ro.disconnect();
      m.remove();
      map.current = null;
      markers.current = {};
    };
    // places is static JSON
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect collected + active state on the pins.
  useEffect(() => {
    for (const [id, { el }] of Object.entries(markers.current)) {
      el.classList.toggle("is-collected", collected.includes(id));
      el.classList.toggle("is-active", id === activeId);
      el.setAttribute("aria-pressed", String(id === activeId));
    }
  }, [collected, activeId]);

  // Fly to the active place, or pull back out when it clears.
  useEffect(() => {
    const m = map.current;
    if (!m) return;
    const token = ++flight.current;

    if (!activeId) {
      m.easeTo({
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
        pitch: 0,
        bearing: 0,
        zoom: Math.min(m.getZoom(), 10.4),
        duration: reduced ? 0 : 900,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        essential: true,
      });
      return;
    }

    const p = places.find((x) => x.id === activeId);
    if (!p) return;
    const h = m.getContainer().clientHeight;
    const padding = { top: 72, bottom: Math.round(h * 0.48), left: 0, right: 0 };
    const arrive = () => token === flight.current && cb.current.onArrive(p.id);

    if (reduced) {
      m.jumpTo({ center: [p.lng, p.lat], zoom: 13.4, pitch: 0, bearing: 0, padding });
      arrive();
      return;
    }

    const duration = 2100;
    m.flyTo({
      center: [p.lng, p.lat],
      zoom: 13.4,
      pitch: 48,
      bearing: -14,
      padding,
      duration,
      curve: 1.5,
      essential: true,
    });
    // Open the sheet as the camera settles, not after it fully stops: feels faster, no dead beat.
    const t = window.setTimeout(arrive, duration * 0.78);
    return () => window.clearTimeout(t);
  }, [activeId, reduced, places]);

  return <div ref={host} className="map" role="region" aria-label="Map of Bohol with six stamp spots" />;
}
