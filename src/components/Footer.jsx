import { business, hours } from "../data";
import Logo from "./Logo";
import { navigateWithCurtain } from "../curtain";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo tagline className="footer__logo" />
          <p className="footer__addr">{business.address}</p>
        </div>

        <div className="footer__col">
          <h4>Explore</h4>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={(e) => navigateWithCurtain(e, l.href)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col">
          <h4>Hours</h4>
          <ul className="footer__hours">
            <li>
              <span>Mon – Sat</span>
              <span>9:00 AM – 6:00 PM</span>
            </li>
            <li>
              <span>Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Get in Touch</h4>
          <ul>
            <li>
              <a href={business.phoneHref}>{business.phone}</a>
            </li>
            <li>
              <a href={business.mapsLink} target="_blank" rel="noreferrer">
                Get Directions
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">
        <div className="container footer__bar-inner">
          <span>
            © {new Date().getFullYear()} {business.fullName}. All rights reserved.
            {" · "}
            <a href="#admin" className="footer__owner">Menu manager</a>
          </span>
          <span className="footer__credits">
            <span>Baked in {business.location}, {hours.filter((h) => !h.closed).length} days a week</span>
            <a
              href="https://www.figmentimaginative.com/go/zukerino-footer"
              target="_blank"
              rel="noopener"
              title="Custom websites by Figment Imaginative"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#FDFBD4",
                border: "1px solid rgba(58,2,91,0.18)",
                color: "#3A025B",
                font: "600 12px/1 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
                textDecoration: "none",
              }}
            >
              <img
                src="https://www.figmentimaginative.com/figment-mark.svg"
                alt=""
                width="14"
                height="14"
                style={{ display: "block" }}
              />
              Site by Figment Imaginative
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
