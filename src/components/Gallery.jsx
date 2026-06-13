import { useCallback, useEffect, useRef, useState } from "react";
import { gallery, isVideo } from "../data";

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const open = index !== null;
  const closeBtn = useRef(null);
  const touchX = useRef(null);

  const show = (i) => setIndex(i);
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
    closeBtn.current?.focus();
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
          {gallery.map((src, i) => {
            const video = isVideo(src);
            return (
              <button
                key={src}
                className={`gallery__item gallery__item--${(i % 5) + 1}`}
                onClick={() => show(i)}
                aria-label={`View ${video ? "video" : "photo"} ${i + 1}`}
              >
                {video ? (
                  <video
                    src={src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                  />
                ) : (
                  <img src={src} alt={`Zukerino Pastry Shop photo ${i + 1}`} loading="lazy" />
                )}
                <span
                  className={`gallery__zoom ${video ? "gallery__zoom--play" : ""}`}
                  aria-hidden="true"
                >
                  {video ? "▶" : "+"}
                </span>
              </button>
            );
          })}
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
          <button className="lightbox__close" aria-label="Close" onClick={close} ref={closeBtn}>
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
            {isVideo(gallery[index]) ? (
              <video
                src={gallery[index]}
                controls
                autoPlay
                playsInline
                aria-label={`Zukerino Pastry Shop video ${index + 1}`}
              />
            ) : (
              <img src={gallery[index]} alt={`Zukerino Pastry Shop photo ${index + 1}`} />
            )}
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
