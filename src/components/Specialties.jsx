import { specialties } from "../data";

export default function Specialties() {
  return (
    <section id="favorites" className="section section--alt specialties">
      <div className="container">
        <div className="sp__head reveal">
          <p className="eyebrow">From Our Cases</p>
          <h2 className="section-title">What's in the case</h2>
          <p className="section-lead">
            A few things people drive across town for. Everything is baked here, from
            scratch, the same way it has always been done.
          </p>
        </div>

        <div className="sp__grid">
          {specialties.map((item, i) => (
            <article
              key={item.name}
              className={`sp__card reveal ${item.feature ? "sp__card--feature" : ""}`}
              style={{ transitionDelay: `${(i % 3) * 80}ms` }}
            >
              {item.tag && <span className="sp__tag">{item.tag}</span>}
              <span className="sp__num">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`sp__title ${item.teal && !item.feature ? "hl" : ""}`}>{item.name}</h3>
              <p className="sp__desc">
                {item.feature ? (
                  <>Rounds, sheets, and tiers decorated to order for birthdays and big days — <span className="hl">available upon phone request</span>.</>
                ) : item.name === "Cheesecakes" ? (
                  <>Creamy and not too sweet — made in <span className="hl">almost all of our cake flavors</span>.</>
                ) : (
                  item.desc
                )}
              </p>
            </article>
          ))}
        </div>

        <div className="sp__cta reveal">
          <a href="#menu" className="btn btn-primary">View the Full Menu</a>
        </div>
      </div>
    </section>
  );
}
