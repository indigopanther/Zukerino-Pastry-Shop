import { useEffect, useRef, useState } from "react";

/*
 * PastryCurtain — a full-screen transition: two espresso panels sweep in
 * from the left and right, a cannoli pops up while the screen is covered,
 * then the panels sweep back open.
 *
 * Plays on browser back/forward (popstate) and can be triggered manually
 * for section navigation via `navigateWithCurtain`.
 */

import { registerCurtain, reducedMotion } from "../curtain";

const CLOSE_MS = 560; // panels sliding shut
const HOLD_MS = 640; // the cannoli moment
const OPEN_MS = 620; // panels sliding open

function CannoliSVG() {
  return (
    <svg viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="cannoliShell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d99a4e" />
          <stop offset="0.55" stopColor="#b87427" />
          <stop offset="1" stopColor="#94581a" />
        </linearGradient>
      </defs>

      <g transform="rotate(-10 115 65)">
        {/* cream ruffles, left end */}
        <g fill="#fff6e6" stroke="#ecd9b8" strokeWidth="1.5">
          <circle cx="46" cy="52" r="11" />
          <circle cx="38" cy="65" r="13" />
          <circle cx="48" cy="79" r="11" />
          <circle cx="55" cy="64" r="12" />
        </g>
        {/* cream ruffles, right end */}
        <g fill="#fff6e6" stroke="#ecd9b8" strokeWidth="1.5">
          <circle cx="184" cy="52" r="11" />
          <circle cx="192" cy="65" r="13" />
          <circle cx="182" cy="79" r="11" />
          <circle cx="175" cy="64" r="12" />
        </g>
        {/* pistachio flecks on the cream */}
        <g fill="#7d9a4e">
          <circle cx="40" cy="58" r="2.2" />
          <circle cx="50" cy="72" r="2" />
          <circle cx="35" cy="70" r="1.8" />
          <circle cx="190" cy="58" r="2.2" />
          <circle cx="180" cy="72" r="2" />
          <circle cx="195" cy="70" r="1.8" />
        </g>

        {/* shell */}
        <rect x="52" y="42" width="126" height="46" rx="23" fill="url(#cannoliShell)" />
        {/* pastry wrap seams */}
        <path d="M88 43 q-11 22 0 44" fill="none" stroke="#7c4a14" strokeWidth="3" opacity="0.45" />
        <path d="M118 42.5 q-11 22.5 0 45" fill="none" stroke="#7c4a14" strokeWidth="3" opacity="0.45" />
        <path d="M148 43 q-11 22 0 44" fill="none" stroke="#7c4a14" strokeWidth="3" opacity="0.45" />
        {/* glossy highlight */}
        <path d="M62 52 q53 -12 106 0" fill="none" stroke="#eebf7e" strokeWidth="5" strokeLinecap="round" opacity="0.6" />

        {/* powdered sugar */}
        <g fill="#fffdf8" opacity="0.9">
          <circle cx="80" cy="36" r="1.6" />
          <circle cx="103" cy="32" r="1.3" />
          <circle cx="127" cy="35" r="1.7" />
          <circle cx="150" cy="31" r="1.2" />
          <circle cx="139" cy="38" r="1.1" />
          <circle cx="92" cy="30" r="1.1" />
        </g>
      </g>

      {/* sparkles */}
      <g fill="#e7c98a">
        <path d="M22 30 l2.4 6 6 2.4 -6 2.4 -2.4 6 -2.4 -6 -6 -2.4 6 -2.4z" />
        <path d="M205 92 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
        <path d="M203 22 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" />
      </g>
    </svg>
  );
}

export default function PastryCurtain() {
  const [active, setActive] = useState(false);
  const [closed, setClosed] = useState(false);
  const running = useRef(false);
  const timers = useRef([]);

  useEffect(() => {
    const clearTimers = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const play = (onCovered) => {
      if (running.current) {
        if (onCovered) onCovered();
        return;
      }
      running.current = true;
      setActive(true);
      // double rAF so the panels mount off-screen before sliding in
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setClosed(true))
      );
      timers.current.push(
        setTimeout(() => onCovered && onCovered(), CLOSE_MS + 60),
        setTimeout(() => setClosed(false), CLOSE_MS + HOLD_MS),
        setTimeout(() => {
          setActive(false);
          running.current = false;
          clearTimers();
        }, CLOSE_MS + HOLD_MS + OPEN_MS)
      );
    };

    const unregister = registerCurtain(play);
    const onPop = () => {
      if (!reducedMotion()) play(null);
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      clearTimers();
      unregister();
    };
  }, []);

  return (
    <div
      className={`curtain ${active ? "curtain--active" : ""} ${
        closed ? "curtain--closed" : ""
      }`}
      aria-hidden="true"
    >
      <div className="curtain__panel curtain__panel--left" />
      <div className="curtain__panel curtain__panel--right" />
      <div className="curtain__pastry">
        <CannoliSVG />
        <span className="curtain__word">Zukerino</span>
      </div>
    </div>
  );
}
