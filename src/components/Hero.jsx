import { useEffect, useState } from "react";
import { business, heroImage, heroVideo, gallery, isVideo } from "../data";

// Rotating background images for the landing hero (first unique, non-video shots).
const heroSlides = [heroImage, ...gallery]
  .filter((s, i, a) => s && !isVideo(s) && a.indexOf(s) === i)
  .slice(0, 6);

export default function Hero() {
  const bgVideo = heroVideo || (isVideo(heroImage) ? heroImage : null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (bgVideo || heroSlides.length < 2) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, [bgVideo]);

  return (
    <section id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        {bgVideo ? (
          <video
            src={bgVideo}
            autoPlay
            muted
            loop
            playsInline
            poster={!isVideo(heroImage) ? heroImage : undefined}
          />
        ) : (
          heroSlides.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`hero__slide ${i === idx ? "is-active" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))
        )}
        <div className="hero__veil"></div>
      </div>

      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow">Family-owned · Atlanta, GA</p>
        <h1 className="hero__title">
          Greek &amp; Italian pastries,
          <em> baked fresh every morning.</em>
        </h1>
        <p className="hero__lead">
          {business.fullName} is a family bakery in {business.location}. Baklava, cannoli,
          tiramisu, spanakopita, and custom cakes for birthdays and big days — all made
          in-house, every morning.
        </p>
        <div className="hero__actions">
          <a href="#menu" className="btn btn-primary">
            Explore the Menu
          </a>
          <a href="#visit" className="btn btn-ghost hero__ghost">
            Plan a Visit
          </a>
        </div>

        <div className="hero__thumbs" aria-hidden="true">
          {gallery.slice(1, 5).map((src, i) => (
            <span key={i} style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      </div>
    </section>
  );
}
