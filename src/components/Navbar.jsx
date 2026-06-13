import { useEffect, useState } from "react";
import { business } from "../data";
import Logo from "./Logo";
import { navigateWithCurtain } from "../curtain";

const links = [
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#visit", label: "Visit" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll + close on Escape while the mobile menu is open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  const onLink = (e, href) => {
    close();
    navigateWithCurtain(e, href);
  };

  return (
    <header className={`nav ${scrolled ? "nav--solid" : ""}`}>
      <div className="container nav__inner">
        <a href="#top" className="nav__brand" onClick={close} aria-label={business.fullName}>
          <Logo className="nav__logo" />
        </a>

        {open && <div className="nav__scrim" onClick={close} aria-hidden="true" />}

        <nav className={`nav__links ${open ? "is-open" : ""}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={(e) => onLink(e, l.href)}>
              {l.label}
            </a>
          ))}
          <a href={business.phoneHref} className="btn btn-primary nav__cta" onClick={close}>
            Call to Order
          </a>
        </nav>

        <button
          className={`nav__toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}
