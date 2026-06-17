import { useEffect } from "react";

// Adds the `.in` class to any `.reveal` element as it scrolls into view.
//
// This is intentionally defensive: menu sections render *after* an async fetch
// (and can change when categories are renamed), so elements appear in the DOM
// after this hook first runs. A plain one-shot querySelectorAll would never see
// those later nodes, leaving them stuck at opacity:0 — which is exactly why the
// menu could look empty on first load (notably on mobile) until you tapped a
// category and scrolled. We fix that by (1) re-scanning for new `.reveal` nodes
// via a MutationObserver, and (2) a safety net that reveals anything already in
// the viewport, so content is never permanently hidden on any device.
export default function useReveal() {
  useEffect(() => {
    const revealEl = (el) => el.classList.add("in");

    // No IntersectionObserver support: just show everything.
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach(revealEl);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            io.unobserve(entry.target);
          }
        });
      },
      // threshold 0 fires as soon as any sliver is visible. A larger value can
      // never trigger for sections taller than the viewport (their max visible
      // ratio is small), which would leave long sections stuck hidden on mobile.
      { threshold: 0, rootMargin: "0px 0px -5% 0px" }
    );

    // Observe every reveal element not already shown (idempotent for repeats).
    const scan = () =>
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => io.observe(el));

    // Reveal anything that is already within the viewport but hasn't fired yet.
    const safety = () =>
      document.querySelectorAll(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) revealEl(el);
      });

    scan();
    safety();

    // Catch reveal elements added to the DOM later (async menu render, etc.).
    const mo = new MutationObserver(() => {
      scan();
      safety();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onLoad = () => {
      scan();
      safety();
    };
    window.addEventListener("load", onLoad);
    const t = setTimeout(safety, 800);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("load", onLoad);
      clearTimeout(t);
    };
  }, []);
}
