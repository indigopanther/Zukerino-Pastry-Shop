import { useEffect, useState } from "react";
import { CATEGORIES } from "../menuData";
import { loadItems, subscribe } from "../menuStore";
import { business } from "../data";

function ItemCard({ item }) {
  return (
    <article className="mi">
      <div className="mi__media">
        <img src={item.img} alt={item.name} loading="lazy" />
        {item.featured && <span className="mi__tag mi__tag--star">★ Featured</span>}
      </div>
      <div className="mi__body">
        <div className="mi__row">
          <h4 className="mi__name">{item.name}</h4>
          {item.price && <span className="mi__price">{item.price}</span>}
        </div>
        {item.desc && <p className="mi__desc">{item.desc}</p>}
      </div>
    </article>
  );
}

export default function Menu() {
  const [items, setItems] = useState(loadItems);
  useEffect(() => subscribe(setItems), []);

  const filled = items.filter((i) => i.name.trim());
  const featured = filled.filter((i) => i.featured);
  const cats = CATEGORIES
    .map((name) => ({ name, items: filled.filter((i) => i.category === name) }))
    .filter((c) => c.items.length);

  if (!filled.length) {
    return (
      <section id="menu" className="section menu">
        <div className="container">
          <div className="menu__head reveal">
            <p className="eyebrow">The Menu</p>
            <h2 className="section-title">Menu coming soon</h2>
            <p className="section-lead">
              We're putting our full menu together. In the meantime, call{" "}
              <a href={business.phoneHref}>{business.phone}</a> — we're happy to help.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const sections = [
    ...(featured.length ? [{ name: "Featured", items: featured, id: "featured" }] : []),
    ...cats.map((c) => ({ ...c, id: c.name.toLowerCase().replace(/\s+/g, "-") })),
  ];

  const jump = (e, id) => {
    e.preventDefault();
    const el = document.getElementById("cat-" + id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 96, behavior: "smooth" });
  };

  return (
    <section id="menu" className="section menu">
      <div className="container">
        <div className="menu__head reveal">
          <p className="eyebrow">The Menu</p>
          <h2 className="section-title">Everything in the case</h2>
          <p className="section-lead">
            Baked here, from scratch. Prices are in-store — call to order anything ahead.
          </p>
        </div>

        <nav className="menu__nav" aria-label="Menu categories">
          {sections.map((s) => (
            <a key={s.id} href={`#cat-${s.id}`} className="menu__chip" onClick={(e) => jump(e, s.id)}>
              {s.name}
            </a>
          ))}
        </nav>

        {sections.map((s) => (
          <div key={s.id} id={`cat-${s.id}`} className="menu__cat reveal">
            <div className="menu__cat-head">
              <h3 className="menu__cat-title">{s.name}</h3>
            </div>
            <div className="menu__grid">
              {s.items.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        <p className="menu__cta reveal">
          Want something for a birthday or party?{" "}
          <a href={business.phoneHref}>Call {business.phone}</a> — quick, even on short notice.
        </p>
      </div>
    </section>
  );
}
