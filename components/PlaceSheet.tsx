"use client";
import { motion, type PanInfo } from "framer-motion";
import type { Place } from "@/lib/places";
import { CheckIcon, CloseIcon, PassportIcon, StampIcon } from "./Icons";

type Props = {
  place: Place;
  collected: boolean;
  busy: boolean;
  reduced: boolean;
  onCollect: () => void;
  onOpenPassport: () => void;
  onClose: () => void;
};

export default function PlaceSheet({ place, collected, busy, reduced, onCollect, onOpenPassport, onClose }: Props) {
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 90 || info.velocity.y > 600) onClose();
  };

  return (
    <motion.section
      className="sheet"
      role="dialog"
      aria-modal="false"
      aria-labelledby="sheet-title"
      style={{ ["--stamp" as string]: place.ink }}
      initial={reduced ? { opacity: 0 } : { y: "100%" }}
      animate={reduced ? { opacity: 1 } : { y: 0 }}
      exit={reduced ? { opacity: 0 } : { y: "100%" }}
      transition={reduced ? { duration: 0.12 } : { type: "spring", stiffness: 420, damping: 38, mass: 0.9 }}
      drag={reduced ? false : "y"}
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={{ top: 0.04, bottom: 0.7 }}
      onDragEnd={onDragEnd}
    >
      <div className="sheet__grip" aria-hidden="true" />
      <div className="sheet__photo">
        {/* Plain img: hotlinked Commons thumbnail, no image optimiser needed for a demo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={place.photo} alt={`${place.name}, ${place.town}`} draggable={false} />
        <a className="credit" href={place.source} target="_blank" rel="noopener noreferrer">
          Photo · {place.credit} · {place.license}
        </a>
      </div>

      <div className="sheet__body">
        <div className="sheet__head">
          <div>
            <h2 id="sheet-title" className="sheet__title">
              {place.name}
            </h2>
            <p className="sheet__town">{place.town}, Bohol</p>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <p className="sheet__blurb">{place.blurb}</p>

        <div className="sheet__actions">
          {collected ? (
            <>
              <span className="btn btn--done" aria-live="polite">
                <CheckIcon /> Stamp collected
              </span>
              <button type="button" className="btn btn--ghost" onClick={onOpenPassport}>
                <PassportIcon /> See passport
              </button>
            </>
          ) : (
            <button type="button" className="btn btn--primary" onClick={onCollect} disabled={busy}>
              <StampIcon /> Collect stamp
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}
