"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PageFlip } from "page-flip";
import { PLACES, stampSrc } from "@/lib/places";
import type { Stamp } from "@/lib/useStamps";
import { ChevronLeft, ChevronRight, CloseIcon, ResetIcon } from "./Icons";

type Props = {
  stamps: Stamp[];
  reduced: boolean;
  startAt?: string | null;
  onClose: () => void;
  onReset: () => void;
};

const PER_PAGE = 2;
const STAMP_PAGES = Math.ceil(PLACES.length / PER_PAGE);
const FIRST_STAMP_PAGE = 2; // 0 cover, 1 holder page
const fmt = (t: number) =>
  new Date(t).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();

/**
 * StPageFlip owns and moves the DOM nodes it is given, which fights React.
 * So React renders the pages into a hidden source, and the book is built from
 * clones inside a host element React never touches.
 */
export default function Passport({ stamps, reduced, startAt, onClose, onReset }: Props) {
  const source = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const flip = useRef<PageFlip | null>(null);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [confirmReset, setConfirmReset] = useState(false);

  const byId = useMemo(() => Object.fromEntries(stamps.map((s) => [s.id, s])), [stamps]);
  const startPage = useMemo(() => {
    if (!startAt) return 0;
    const i = PLACES.findIndex((p) => p.id === startAt);
    return i < 0 ? 0 : FIRST_STAMP_PAGE + Math.floor(i / PER_PAGE);
  }, [startAt]);

  useEffect(() => {
    const src = source.current;
    const h = host.current;
    if (!src || !h) return;
    const book = document.createElement("div");
    book.className = "book";
    h.appendChild(book);
    const pages = Array.from(src.children).map((n) => n.cloneNode(true) as HTMLElement);
    pages.forEach((p) => book.appendChild(p));

    const box = h.getBoundingClientRect();
    // One page on phones, a spread when there is room for two.
    const pageH = Math.min(box.height, 600);
    const pageW = Math.round(Math.min(pageH * 0.7, box.width > 760 ? box.width / 2 : box.width));

    const pf = new PageFlip(book, {
      width: pageW,
      height: Math.round(pageW / 0.7),
      size: "fixed" as never,
      showCover: true,
      usePortrait: true,
      autoSize: true,
      drawShadow: true,
      maxShadowOpacity: 0.35,
      flippingTime: reduced ? 1 : 640,
      mobileScrollSupport: false,
      swipeDistance: 24,
      showPageCorners: !reduced,
      startPage,
    });
    pf.loadFromHTML(book.querySelectorAll<HTMLElement>(".page"));
    flip.current = pf;
    setTotal(pf.getPageCount());
    setPage(pf.getCurrentPageIndex());
    pf.on("flip", (e) => setPage(Number(e.data)));

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") pf.flipNext();
      if (e.key === "ArrowLeft") pf.flipPrev();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      try {
        pf.destroy();
      } catch {
        /* already gone */
      }
      h.innerHTML = "";
      flip.current = null;
    };
    // Rebuild only when the stamps change (after a reset) — content is cloned.
  }, [stamps, reduced, startPage, onClose]);

  const next = () => (reduced ? flip.current?.turnToNextPage() : flip.current?.flipNext());
  const prev = () => (reduced ? flip.current?.turnToPrevPage() : flip.current?.flipPrev());

  return (
    <motion.div
      className="passport"
      role="dialog"
      aria-modal="true"
      aria-label="Your passport"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.1 : 0.22 }}
    >
      <header className="passport__bar">
        <p className="passport__count">
          <strong>{stamps.length}</strong> of {PLACES.length} stamps
        </p>
        <button type="button" className="icon-btn icon-btn--light" onClick={onClose} aria-label="Close passport">
          <CloseIcon />
        </button>
      </header>

      <motion.div
        className="passport__stage"
        initial={reduced ? false : { y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div ref={host} className="passport__host" />
      </motion.div>

      <footer className="passport__controls">
        <button type="button" className="btn btn--pill" onClick={prev} disabled={page === 0} aria-label="Previous page">
          <ChevronLeft /> Back
        </button>
        <span className="passport__page" aria-live="polite">
          {page + 1} / {total || "…"}
        </span>
        <button
          type="button"
          className="btn btn--pill"
          onClick={next}
          disabled={total > 0 && page >= total - 1}
          aria-label="Next page"
        >
          Turn <ChevronRight />
        </button>
      </footer>
      <div className="passport__reset">
        {confirmReset ? (
          <>
            <span>Clear all stamps?</span>
            <button
              type="button"
              className="btn btn--small btn--danger"
              onClick={() => {
                onReset();
                setConfirmReset(false);
              }}
            >
              Clear
            </button>
            <button type="button" className="btn btn--small" onClick={() => setConfirmReset(false)}>
              Keep
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--small"
            onClick={() => setConfirmReset(true)}
            disabled={stamps.length === 0}
          >
            <ResetIcon size={16} /> Start over
          </button>
        )}
      </div>

      {/* Hidden source pages; cloned into the book above. */}
      <div ref={source} hidden>
        <div className="page page--cover" data-density="hard">
          <div className="cover">
            <Emblem />
            <p className="cover__title">Island Passport</p>
            <p className="cover__sub">Bohol · Stamp book</p>
            <p className="cover__hint">Swipe or tap the corner to open</p>
          </div>
        </div>

        <div className="page page--paper">
          <div className="holder">
            <p className="page__label">Holder</p>
            <div className="holder__grid">
              <div className="holder__photo" aria-hidden="true">
                <Emblem small />
              </div>
              <dl>
                <dt>Name</dt>
                <dd>Island Traveller</dd>
                <dt>Issued at</dt>
                <dd>Tagbilaran</dd>
                <dt>Stamps</dt>
                <dd>
                  {stamps.length} of {PLACES.length}
                </dd>
              </dl>
            </div>
            <p className="holder__note">Collect a stamp at each spot on the map. Every page holds two.</p>
            <p className="mrz">
              P&lt;BOHISLAND&lt;&lt;TRAVELLER&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
              <br />
              IP{String(stamps.length).padStart(2, "0")}06BOH&lt;&lt;7&lt;2026&lt;&lt;&lt;&lt;&lt;&lt;
            </p>
          </div>
        </div>

        {Array.from({ length: STAMP_PAGES }, (_, pi) => (
          <div className="page page--paper" key={pi}>
            <div className="stamps">
              <p className="page__label">Entries · {pi + 1}</p>
              {PLACES.slice(pi * PER_PAGE, pi * PER_PAGE + PER_PAGE).map((p) => {
                const s = byId[p.id];
                return (
                  <figure key={p.id} className={`slot ${s ? "slot--filled" : ""}`} style={{ ["--stamp" as string]: p.ink }}>
                    <div className="slot__frame">
                      {s ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={stampSrc(p.id)} alt={`${p.name} stamp`} style={{ rotate: `${s.tilt}deg` }} />
                      ) : (
                        <span className="slot__empty">Not yet</span>
                      )}
                    </div>
                    <figcaption>
                      <span>{p.name}</span>
                      <span className="slot__date">{s ? fmt(s.at) : p.town}</span>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        ))}

        <div className="page page--paper">
          <div className="endorse">
            <p className="page__label">Endorsements</p>
            {stamps.length === PLACES.length ? (
              <div className="complete">
                <Emblem />
                <p>All six stamps. Bohol, complete.</p>
              </div>
            ) : (
              <p className="endorse__text">
                {PLACES.length - stamps.length} spot{PLACES.length - stamps.length === 1 ? "" : "s"} left on the map.
                This page gets a seal when the book is full.
              </p>
            )}
          </div>
        </div>

        <div className="page page--cover page--back" data-density="hard">
          <div className="cover cover--back">
            <p className="cover__sub">Island Passport · Bohol</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Emblem({ small }: { small?: boolean }) {
  const s = small ? 56 : 112;
  return (
    <svg viewBox="0 0 100 100" width={s} height={s} className="emblem" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
      <path d="M50 14 L54 46 L50 50 L46 46 Z" fill="currentColor" />
      <path d="M50 86 L46 54 L50 50 L54 54 Z" fill="currentColor" opacity="0.55" />
      <path d="M22 66 Q30 50 38 64 Q46 46 56 63 Q64 52 76 66 Z" fill="currentColor" />
      <path d="M20 70 H80" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
