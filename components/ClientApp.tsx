"use client";
import dynamic from "next/dynamic";

// MapLibre and StPageFlip touch window on import, so the whole app is client-only.
const IslandPassport = dynamic(() => import("./IslandPassport"), {
  ssr: false,
  loading: () => (
    <main className="app app--loading">
      <p className="loading">Unfolding the map…</p>
    </main>
  ),
});

export default function ClientApp() {
  return <IslandPassport />;
}
