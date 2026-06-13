/*
 * Tiny event bus for the PastryCurtain transition, kept outside the
 * component file so other components can import it freely.
 */

let _play = null;

export const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Called by PastryCurtain on mount. Returns an unregister function. */
export function registerCurtain(fn) {
  _play = fn;
  return () => {
    if (_play === fn) _play = null;
  };
}

/** Play the curtain. `onCovered` runs while the screen is fully hidden. */
export function playCurtain(onCovered) {
  if (_play && !reducedMotion()) _play(onCovered);
  else if (onCovered) onCovered();
}

/**
 * Anchor click handler: covers the screen, jumps to the section while
 * hidden (pushing a history entry so back/forward works), then reopens.
 * Falls back to the default anchor jump when reduced motion is preferred.
 */
export function navigateWithCurtain(e, href) {
  if (reducedMotion() || !_play) return;
  e.preventDefault();
  playCurtain(() => {
    const el = document.querySelector(href);
    window.history.pushState(null, "", href);
    if (el) {
      const root = document.documentElement;
      const prevBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto"; // jump instantly while covered
      el.scrollIntoView();
      root.style.scrollBehavior = prevBehavior;
    }
  });
}
