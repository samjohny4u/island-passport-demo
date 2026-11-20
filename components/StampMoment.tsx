"use client";
import { useEffect } from "react";
import { useAnimate } from "framer-motion";
import { stampSrc, type Place } from "@/lib/places";
import { thud } from "@/lib/useStamps";

type Props = { place: Place; tilt: number; reduced: boolean; onImpact: () => void; onDone: () => void };

const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));
// Gravity-like ease-in for the drop, long exponential ease-out for everything that settles.
const DROP = [0.55, 0, 0.92, 0.45] as const;
const SETTLE = [0.16, 1, 0.3, 1] as const;

/**
 * The stamp moment, timed like a real rubber stamp:
 * drop 240 ms → impact (squash, haptic, ink spreads 420 ms) → lift → imprint bounce → flies into the passport.
 */
export default function StampMoment({ place, tilt, reduced, onImpact, onDone }: Props) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      const root = scope.current as HTMLElement;
      if (reduced) {
        await animate(root, { opacity: [0, 1] }, { duration: 0.12 });
        await animate(".imprint", { opacity: [0, 1] }, { duration: 0.15 });
        onImpact();
        await animate(".caption", { opacity: [0, 1] }, { duration: 0.12 });
        await wait(0.9);
        if (cancelled) return;
        await animate(root, { opacity: 0 }, { duration: 0.15 });
        onDone();
        return;
      }

      await animate(root, { opacity: [0, 1] }, { duration: 0.16 });
      animate(".paper", { scale: [0.94, 1], y: [24, 0] }, { duration: 0.32, ease: SETTLE });
      await wait(0.12);
      await animate(".tool", { y: ["-135%", "0%"] }, { duration: 0.24, ease: DROP });
      if (cancelled) return;

      // Impact.
      thud([22]);
      onImpact();
      animate(".tool", { scaleY: [1, 0.88, 1], scaleX: [1, 1.05, 1] }, { duration: 0.2, ease: "easeOut" });
      animate(".paper", { scale: [1, 0.982, 1] }, { duration: 0.24, ease: "easeOut" });
      animate(".splat", { scale: [0.7, 1.18], opacity: [0.45, 0] }, { duration: 0.5, ease: SETTLE });
      animate(
        ".imprint",
        {
          clipPath: ["circle(0% at 50% 52%)", "circle(72% at 50% 52%)"],
          filter: ["blur(2.5px)", "blur(0px)"],
          opacity: [0.6, 1],
        },
        { duration: 0.42, ease: SETTLE },
      );
      await wait(0.17);
      await animate(".tool", { y: "-150%", rotate: 5 }, { duration: 0.34, ease: SETTLE });
      animate(".caption", { opacity: [0, 1], y: [6, 0] }, { duration: 0.24, ease: SETTLE });
      await animate(".imprint", { scale: [1, 1.07, 0.985, 1] }, { duration: 0.46, ease: "easeOut" });
      await wait(0.45);
      if (cancelled) return;

      // Fly into the passport button in the top bar.
      const target = document.querySelector("[data-passport-target]")?.getBoundingClientRect();
      const paper = root.querySelector(".paper")!.getBoundingClientRect();
      const dx = target ? target.left + target.width / 2 - (paper.left + paper.width / 2) : 0;
      const dy = target ? target.top + target.height / 2 - (paper.top + paper.height / 2) : -300;
      animate(".caption", { opacity: 0 }, { duration: 0.12 });
      animate(root, { backgroundColor: "rgba(23,58,49,0)" }, { duration: 0.5 });
      await animate(".paper", { x: dx, y: dy, scale: 0.1, rotate: 10 }, { duration: 0.56, ease: [0.55, 0, 0.7, 0.2] });
      onDone();
    };
    run();
    return () => {
      cancelled = true;
    };
    // Runs once per mount; place never changes during a moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={scope} className="moment" role="status" aria-label={`Stamping ${place.name}`} style={{ opacity: 0 }}>
      <div className="paper">
        <div className="paper__slot" style={{ ["--stamp" as string]: place.ink }}>
          <span className="splat" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="imprint"
            src={stampSrc(place.id)}
            alt=""
            style={{ rotate: `${tilt}deg`, clipPath: reduced ? undefined : "circle(0% at 50% 52%)", opacity: 0 }}
            draggable={false}
          />
        </div>
        {!reduced && (
          <div className="tool" aria-hidden="true">
            <RubberStamp ink={place.ink} />
          </div>
        )}
      </div>
      <p className="caption" style={{ opacity: 0 }}>
        Stamped · {place.name}
      </p>
    </div>
  );
}

function RubberStamp({ ink }: { ink: string }) {
  return (
    <svg viewBox="0 0 120 150" width="132" height="165">
      <defs>
        <linearGradient id="wood" x1="0" x2="1">
          <stop offset="0" stopColor="#8A5A34" />
          <stop offset="0.55" stopColor="#B07C4E" />
          <stop offset="1" stopColor="#7A4D2C" />
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="22" rx="26" ry="20" fill="url(#wood)" />
      <rect x="49" y="36" width="22" height="46" rx="6" fill="url(#wood)" />
      <rect x="14" y="80" width="92" height="30" rx="7" fill="url(#wood)" />
      <rect x="14" y="80" width="92" height="7" rx="3.5" fill="#000" opacity="0.12" />
      <rect x="18" y="110" width="84" height="16" rx="3" fill="#2B2A26" />
      <rect x="20" y="124" width="80" height="7" rx="2" fill={ink} />
    </svg>
  );
}
