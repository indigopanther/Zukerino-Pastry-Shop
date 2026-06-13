import { useState } from "react";
import { menu, cakeGallery } from "../menu";
import { business } from "../data";

function ItemCard({ item }) {
  return (
    <article className="mi">
      <div className="mi__media">
        {item.img ? (
          <img src={item.img} alt={item.name} loading="lazy" />
        ) : (
          <div className="mi__placeholder" aria-hidden="true">
            <span>Z</span>
          </div>
        )}
        {item.tag && <span className="mi__tag">{item.tag}</span>}
      </div>
      <div className="mi__body">
        <div className="mi__row">
          <h4 className="mi__name">{item.name}</h4>
          <span className="mi__price">{item.price}</span>
        </div>
        {(item.unit || item.sub) && (
          <p className="mi__meta">
            {item.unit && <span>{item.unit}</span>}
            {item.unit && item.sub && " · "}
            {item.sub && <span>{item.sub}</span>}
          </p>
        )}
        {item.desc && <p className="mi__desc">{item.desc}</p>}
      </div>
    </article>
  );
}

export default function Menu() {
  const [active, setActive] = useState(menu[0].id);

  const jump = (e, id) => {
    e.preventDefault();
    setActive(id);
    const el = document.getElementById("cat-" + id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="menu" className="section menu">
      <div className="container">
        <div className="menu__head reveal">
          <p className="eyebrow">The Menu</p>
          <h2 className="section-title">Everything in the case</h2>
          <p className="section-lead">
            Cakes, cheesecakes, baklava, cookies, pastries, and pies — all baked here,
            from scratch. Prices are in-store; call to order anything ahead.
          </p>
        </div>

        <nav className="menu__nav" aria-label="Menu categories">
          {menu.map((cat) => (
            <a
              key={cat.id}
              href={`#cat-${cat.id}`}
              className={`menu__chip ${active === cat.id ? "is-active" : ""}`}
              onClick={(e) => jump(e, cat.id)}
            >
              {cat.name}
            </a>
          ))}
        </nav>

        {menu.map((cat) => (
          <div key={cat.id} id={`cat-${cat.id}`} className="menu__cat reveal">
            <div className="menu__cat-head">
              <h3 className="menu__cat-title">{cat.name}</h3>
              {cat.blurb && <p className="menu__cat-blurb">{cat.blurb}</p>}
            </div>

            <div className="menu__grid">
              {cat.items.map((item) => (
                <ItemCard key={item.name + item.price} item={item} />
              ))}
            </div>

            {cat.flavors && (
              <div className="menu__flavors">
                <span className="menu__flavors-label">{cat.flavorLabel}</span>
                <div className="menu__chips">
                  {cat.flavors.map((f) => (
                    <span key={f} className="menu__flavor">{f}</span>
                  ))}
                </div>
              </div>
            )}

            {cat.id === "cakes" && (
              <div className="menu__designs">
                <span className="menu__flavors-label">A few of our cake designs</span>
                <div className="menu__designs-scroll">
                  {cakeGallery.map((src, i) => (
                    <img key={src} src={src} alt={`Zukerino cake design ${i + 1}`} loading="lazy" />
                  ))}
                </div>
              </div>
            )}

            {cat.note && <p className="menu__note">{cat.note}</p>}
          </div>
        ))}

        <p className="menu__cta reveal">
          Want something for a birthday or party?{" "}
          <a href={business.phoneHref}>Call {business.phone}</a> — they're quick, even on
          short notice.
        </p>
      </div>
    </section>
  );
}
