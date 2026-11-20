"use client";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import MapView from "./MapView";
import PlaceSheet from "./PlaceSheet";
import StampMoment from "./StampMoment";
import Passport from "./Passport";
import { PassportIcon } from "./Icons";
import { PLACES } from "@/lib/places";
import { usePrefersReducedMotion, useStamps } from "@/lib/useStamps";
import { guillocheUrl } from "@/lib/guilloche";

const GUILLOCHE = guillocheUrl("#B5C5AF", 0.9);

type Moment = { id: string; tilt: number; impacted: boolean };

export default function IslandPassport() {
  const reduced = usePrefersReducedMotion();
  const { stamps, ready, collect, reset, has } = useStamps();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(null);
  const [moment, setMoment] = useState<Moment | null>(null);
  const [passport, setPassport] = useState<{ open: boolean; at: string | null }>({ open: false, at: null });
  const [bump, setBump] = useState(0);

  // Preload photos and stamps once the map is up, so the sheet never opens on a blank frame.
  useEffect(() => {
    const t = setTimeout(() => {
      PLACES.forEach((p) => {
        new Image().src = p.photo;
        new Image().src = `/stamps/${p.id}.svg`;
      });
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const onPinTap = useCallback((id: string) => {
    setSheetId(null);
    setActiveId(id);
  }, []);
  const onArrive = useCallback((id: string) => setSheetId(id), []);
  const closeSheet = useCallback(() => {
    setSheetId(null);
    setActiveId(null);
  }, []);
  const closePassport = useCallback(() => setPassport({ open: false, at: null }), []);

  const startStamp = () => {
    if (!sheetId || has(sheetId)) return;
    setMoment({ id: sheetId, tilt: Math.round((Math.random() * 12 - 6) * 10) / 10, impacted: false });
  };

  const place = PLACES.find((p) => p.id === sheetId) ?? null;
  const momentPlace = moment ? PLACES.find((p) => p.id === moment.id)! : null;
  // The counter only ticks when the stamp lands in the passport, not at impact.
  const shown = stamps.length - (moment?.impacted ? 1 : 0);

  return (
    <main className="app" style={{ ["--guilloche" as string]: GUILLOCHE }}>
      <MapView
        places={PLACES}
        collected={stamps.map((s) => s.id)}
        activeId={activeId}
        reduced={reduced}
        onPinTap={onPinTap}
        onArrive={onArrive}
      />

      <header className="topbar">
        <div className="brand">
          <span className="brand__name">Island Passport</span>
          <span className="brand__place">Bohol, Philippines</span>
        </div>
        <motion.button
          type="button"
          className="passport-btn"
          data-passport-target
          onClick={() => setPassport({ open: true, at: null })}
          aria-label={`Open passport, ${shown} of ${PLACES.length} stamps`}
          key={bump}
          animate={bump && !reduced ? { scale: [1, 1.14, 0.97, 1] } : undefined}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <PassportIcon />
          <span className="passport-btn__count" aria-hidden="true">
            <span className="tabular">{ready ? shown : "–"}</span>
            <span className="passport-btn__of">/{PLACES.length}</span>
          </span>
        </motion.button>
      </header>

      <p className="hint" aria-live="polite" data-hidden={Boolean(activeId) || stamps.length > 0}>
        Tap a pin to fly there
      </p>

      <AnimatePresence>
        {place && (
          <PlaceSheet
            key={place.id}
            place={place}
            collected={has(place.id) && !moment}
            busy={Boolean(moment)}
            reduced={reduced}
            onCollect={startStamp}
            onOpenPassport={() => setPassport({ open: true, at: place.id })}
            onClose={closeSheet}
          />
        )}
      </AnimatePresence>

      {moment && momentPlace && (
        <StampMoment
          key={moment.id}
          place={momentPlace}
          tilt={moment.tilt}
          reduced={reduced}
          onImpact={() => {
            collect(moment.id, moment.tilt);
            setMoment((m) => (m ? { ...m, impacted: true } : m));
          }}
          onDone={() => {
            setMoment(null);
            setBump((b) => b + 1);
          }}
        />
      )}

      <AnimatePresence>
        {passport.open && (
          <Passport stamps={stamps} reduced={reduced} startAt={passport.at} onClose={closePassport} onReset={reset} />
        )}
      </AnimatePresence>
    </main>
  );
}
