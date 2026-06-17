import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, galleryAlt } from "../data";

const altFor = (i) =>
  galleryAlt[i] || "Pastries and desserts at Zukerino Pastry Shop in Atlanta, GA";

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const open = index !== null;
  const touchX = useRef(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i + gallery.length - 1) % gallery.length),
    []
  );
  const next = useCallback(() => setIndex((i) => (i + 1) % gallery.length), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  // Swipe left/right to change photos on touch screens
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 48) (dx > 0 ? prev : next)();
  };

  return (
    <section id="gallery" className="section gallery">
      <div className="container">
        <div className="gallery__head reveal">
          <p className="eyebrow">Photos</p>
          <h2 className="section-title">Have a look around</h2>
          <p className="section-lead">
            The cases, the seating, the cakes. Tap any photo to see it up close.
          </p>
        </div>

        <div className="gallery__grid reveal">
          {gallery.map((src, i) => (
            <button
              key={src}
              className={`gallery__item gallery__item--${(i % 7) + 1}`}
              onClick={() => setIndex(i)}
              aria-label={`View larger: ${altFor(i)}`}
            >
              <span className="gallery__photo">
                <img src={src} alt={altFor(i)} loading="lazy" />
                <span className="gallery__zoom" aria-hidden="true">+</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {open && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={close}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button className="lightbox__close" aria-label="Close" onClick={close}>
            ×
          </button>
          <button
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            ‹
          </button>
          <figure className="lightbox__figure" onClick={(e) => e.stopPropagation()}>
            <img src={gallery[index]} alt={altFor(index)} />
            <figcaption>
              {index + 1} / {gallery.length}
            </figcaption>
          </figure>
          <button
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}
