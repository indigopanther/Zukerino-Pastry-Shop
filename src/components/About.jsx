import { gallery, highlights } from "../data";

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container about__grid">
        <div className="about__media reveal">
          <img src={gallery[2]} alt="Inside Zukerino Pastry Shop" className="about__img-main" />
          <img src={gallery[5]} alt="The Zukerino patio in Atlanta" className="about__img-sub" />
          <div className="about__badge">
            <span className="about__badge-script">Since</span>
            <span className="about__badge-script" style={{ marginTop: "-6px" }}>day one</span>
            <span className="about__badge-sub">Family owned &amp; operated</span>
          </div>
        </div>

        <div className="about__copy reveal">
          <p className="eyebrow">Our Story</p>
          <h2 className="section-title">A little corner of Europe in Atlanta</h2>
          <p className="about__text">
            Zukerino is a small, <span className="hl">family-owned</span> wholesale and retail
            pastry shop on Cotillion Drive. The recipes are Greek and Italian — baklava, cannoli,
            tiramisu, spanakopita — and everything in the case was <span className="hl">baked here that morning</span>.
            <span className="hl"> Custom cakes</span> are available upon phone request.
          </p>
          <p className="about__text">
            The shop itself is small: a few tables, a long display case, and whoever is
            working will probably hand you a sample before you've decided what to order.
            People tend to come in for one thing and leave with a box.
          </p>

          <div className="about__stats">
            {highlights.map((h) => (
              <div key={h.stat} className={`about__stat ${h.teal ? "is-teal" : ""}`}>
                <strong>{h.stat}</strong>
                <span>{h.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
