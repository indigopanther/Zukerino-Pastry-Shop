import { useEffect, useState } from "react";
import { business, heroSlides, gallery } from "../data";

export default function Hero() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % heroSlides.length), 5500);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="top" className="hero">
      <div className="hero__bg" aria-hidden="true">
        {heroSlides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={`hero__slide ${i === idx ? "is-active" : ""}`}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        <div className="hero__veil"></div>
      </div>

      <div className="container hero__inner">
        <p className="eyebrow hero__eyebrow">Wholesale and Retail Pastry Shop · Atlanta, GA</p>
        <h1 className="hero__title">Greek &amp; Italian pastries,</h1>
        <p className="hero__title-sub">baked fresh every morning.</p>
        <p className="hero__lead">
          {business.name} is a family-owned wholesale and retail pastry shop in {business.location}.
          Baklava, cannoli, tiramisu, spanakopita, and <span className="hl">custom cakes</span> by
          phone request — all made in-house, every single day.
        </p>
        <div className="hero__actions">
          <a href="#menu" className="btn btn-primary">Explore the Menu</a>
          <a href="#visit" className="btn btn-light">Plan a Visit</a>
        </div>

        <div className="hero__thumbs" aria-hidden="true">
          {gallery.slice(1, 5).map((src, i) => (
            <span key={i} className="hero__thumb" style={{ backgroundImage: `url(${src})` }}></span>
          ))}
        </div>
      </div>

      <div className="hero__scroll" aria-hidden="true">Scroll</div>
    </section>
  );
}
