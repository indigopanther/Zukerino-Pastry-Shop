import { business, hours } from "../data";

const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

export default function Visit() {
  return (
    <section id="visit" className="section visit">
      <div className="container visit__grid">
        <div className="visit__info reveal">
          <p className="eyebrow">Visit Us</p>
          <h2 className="section-title">Come say hello</h2>
          <p className="section-lead">
            Stop in for something sweet, or call ahead and your order will be boxed and
            waiting at the counter.
          </p>

          <div className="visit__rows">
            <div className="visit__row">
              <span className="visit__label">Address</span>
              <a href={business.mapsLink} target="_blank" rel="noreferrer" className="visit__value">
                {business.address}
              </a>
            </div>
            <div className="visit__row">
              <span className="visit__label">Phone</span>
              <a href={business.phoneHref} className="visit__value">
                {business.phone}
              </a>
            </div>
          </div>

          <div className="visit__hours">
            <span className="visit__label">Opening Hours</span>
            <ul>
              {hours.map((h) => (
                <li
                  key={h.day}
                  className={`${h.closed ? "is-closed" : ""} ${
                    h.day === today ? "is-today" : ""
                  }`}
                >
                  <span>{h.day}{h.day === today ? " · Today" : ""}</span>
                  <span>{h.time}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="visit__actions">
            <a href={business.phoneHref} className="btn btn-primary">
              Call to Order
            </a>
            <a href={business.mapsLink} target="_blank" rel="noreferrer" className="btn btn-ghost">
              Get Directions
            </a>
          </div>
        </div>

        <div className="visit__map reveal">
          <iframe
            src={business.mapEmbed}
            title="Map to Zukerino Pastry Shop"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </section>
  );
}
