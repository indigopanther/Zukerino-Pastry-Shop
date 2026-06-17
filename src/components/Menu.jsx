import { useEffect, useState } from "react";
import { CATEGORIES } from "../menuData";
import { DietIcon, MenuKey } from "../diet";
import { loadItems, subscribe, fetchItems } from "../menuStore";
import { business } from "../data";

function MenuItem({ item }) {
  return (
    <article className="mi">
      <div className="mi__media">
        <img src={item.img} alt={item.name || "Zukerino specialty"} loading="lazy" />
        {item.featured && <span className="mi__tag">★ Featured</span>}
        <span className="mi__brand" aria-hidden="true">
          <img src="/assets/zukerino-light.png" alt="" />
        </span>
      </div>
      <div className="mi__body">
        <div className="mi__row">
          <h4 className="mi__name">{item.name}</h4>
          {item.price && <span className="mi__price">{item.price}</span>}
        </div>
        {item.desc ? (
          <p className="mi__desc">{item.desc}</p>
        ) : (
          !item.name && <p className="mi__cat-label">{item.category}</p>
        )}
        {item.diets && item.diets.length > 0 && (
          <div className="mi__diets">
            {item.diets.map((k) => (
              <DietIcon key={k} k={k} size={22} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Menu() {
  const [items, setItems] = useState(loadItems);
  const [active, setActive] = useState("featured-or-first");
  useEffect(() => {
    const unsub = subscribe(setItems);
    fetchItems(); // pull the latest published menu from Supabase on load
    return unsub;
  }, []);

  const featured = items.filter((i) => i.featured);
  const cats = CATEGORIES.map((name) => ({
    name,
    id: name.toLowerCase().replace(/\s+/g, "-"),
    items: items.filter((i) => i.category === name),
  })).filter((c) => c.items.length);

  const sections = [
    ...(featured.length ? [{ name: "Featured", id: "featured", items: featured }] : []),
    ...cats,
  ];

  const jump = (e, id) => {
    e.preventDefault();
    setActive(id);
    const el = document.getElementById("cat-" + id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 150, behavior: "smooth" });
  };

  const hasDiets = items.some((i) => i.diets && i.diets.length);

  return (
    <section id="menu" className="section menu">
      <div className="container">
        <div className="menu__head">
          <p className="eyebrow">The Menu</p>
          <h2 className="section-title">Everything in the case</h2>
          <p className="section-lead">
            Baked here, from scratch. Prices are in-store — call ahead to reserve anything,
            and browse the full case below.
          </p>
        </div>

        <div className="menu__notes">
          <div className="menu__note">
            <span className="menu__note-ic" aria-hidden="true">◆</span>
            <p>
              <strong>Custom cakes</strong> are made to order for any occasion — just call{" "}
              <a href={business.phoneHref} className="hl">{business.phone}</a> to request one.
            </p>
          </div>
          <div className="menu__note">
            <span className="menu__note-ic" aria-hidden="true">◆</span>
            <p>
              We make <strong>cheesecakes in almost all of our cake flavors</strong> —
              ask for your favorite and we'll let you know.
            </p>
          </div>
        </div>

        {hasDiets && <MenuKey />}

        <nav className="menu__nav" aria-label="Menu categories">
          {sections.map((s) => (
            <button
              key={s.id}
              className={`menu__chip ${active === s.id ? "is-active" : ""}`}
              onClick={(e) => jump(e, s.id)}
            >
              {s.name}
            </button>
          ))}
        </nav>

        {sections.map((s) => (
          <div key={s.id} id={`cat-${s.id}`} className="menu__cat">
            <div className="menu__cat-head">
              <h3 className="menu__cat-title">{s.name}</h3>
              <span className="diamonds" aria-hidden="true">
                <span></span><span></span><span></span>
              </span>
            </div>
            <div className="menu__grid">
              {s.items.map((item) => (
                <MenuItem key={item.id + s.id} item={item} />
              ))}
            </div>
          </div>
        ))}

        <p className="menu__cta">
          Want something for a birthday or party?{" "}
          <a href={business.phoneHref}>Call {business.phone}</a> — we love a good celebration.
        </p>
      </div>
    </section>
  );
}
