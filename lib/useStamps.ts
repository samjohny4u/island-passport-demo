"use client";
import { useCallback, useEffect, useState } from "react";

export type Stamp = { id: string; at: number; tilt: number };
const KEY = "island-passport:v1";

function read(): Stamp[] {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s) => s && typeof s.id === "string") : [];
  } catch {
    return [];
  }
}

function write(stamps: Stamp[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stamps));
  } catch {
    /* private mode or storage full: progress just won't persist */
  }
}

export function useStamps() {
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStamps(read());
    setReady(true);
    const onStorage = (e: StorageEvent) => e.key === KEY && setStamps(read());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const collect = useCallback((id: string, tilt?: number) => {
    setStamps((prev) => {
      if (prev.some((s) => s.id === id)) return prev;
      // A small random tilt makes each stamp look hand-pressed; stored so it stays put.
      const next = [...prev, { id, at: Date.now(), tilt: tilt ?? Math.round((Math.random() * 14 - 7) * 10) / 10 }];
      write(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    write([]);
    setStamps([]);
  }, []);

  return { stamps, ready, collect, reset, has: (id: string) => stamps.some((s) => s.id === id) };
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Short, sharp vibration where supported (Android Chrome). iOS Safari ignores it. */
export function thud(pattern: number | number[] = 18) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* unsupported */
  }
}
