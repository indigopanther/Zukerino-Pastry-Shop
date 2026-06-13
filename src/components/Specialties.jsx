import { specialties } from "../data";

export default function Specialties() {
  return (
    <section id="favorites" className="section specialties">
      <div className="container">
        <div className="specialties__head reveal">
          <p className="eyebrow">From Our Cases</p>
          <h2 className="section-title">What's in the case</h2>
          <p className="section-lead">
            A few things people drive across town for. Everything is baked here, from
            scratch, the same way it has always been done.
          </p>
        </div>

        <div className="specialties__grid">
          {specialties.map((item, i) => (
            <article
              key={item.name}
              className="card reveal"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              {item.tag && <span className="card__tag">{item.tag}</span>}
              <h3 className="card__title">{item.name}</h3>
              <p className="card__desc">{item.desc}</p>
            </article>
          ))}
        </div>

        <p className="specialties__note reveal">
          Need a cake for something? <a href="#visit">Call the shop</a> — they're quick,
          even on short notice.
        </p>
      </div>
    </section>
  );
}
