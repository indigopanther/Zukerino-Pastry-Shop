// Menu symbols (the "menu key") for each dietary attribute.
// Icons are clean, recognizable badges drawn inline so no external assets load.

import { DIETS } from "./menuData";

const GLYPHS = {
  // Wheat with a slash = free of gluten
  "gluten-free": (
    <g fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
      <path d="M12 5v12" />
      <path d="M12 9c-1.7-1.3-3.5-.6-3.5-.6S9 10.3 12 10.1" />
      <path d="M12 9c1.7-1.3 3.5-.6 3.5-.6S15 10.3 12 10.1" />
      <path d="M12 13c-1.7-1.3-3.5-.6-3.5-.6S9 14.3 12 14.1" />
      <path d="M12 13c1.7-1.3 3.5-.6 3.5-.6S15 14.3 12 14.1" />
      <line x1="5.5" y1="18.5" x2="18.5" y2="5.5" strokeWidth="1.7" />
    </g>
  ),
  // Leaf = plant-based / vegan
  vegan: (
    <g>
      <path d="M6.5 17.5c-.5-6 4-10.5 11-11.5-.5 7-4.5 12-11 11.5z" fill="#fff" />
      <path d="M9 15.5c1.8-3 4.4-5.2 6.6-6.4" stroke="#3f7d4f" strokeWidth="1" fill="none" strokeLinecap="round" />
    </g>
  ),
  // Milk drop with a slash = dairy-free
  "dairy-free": (
    <g fill="none" stroke="#fff" strokeWidth="1.4" strokeLinecap="round">
      <path d="M12 6c2.4 3 3.9 5 3.9 7a3.9 3.9 0 0 1-7.8 0c0-2 1.5-4 3.9-7z" />
      <line x1="6.5" y1="17.5" x2="17.5" y2="6.5" strokeWidth="1.7" />
    </g>
  ),
  // Butterfly = Non-GMO
  "non-gmo": (
    <g fill="#fff">
      <ellipse cx="8.8" cy="9.6" rx="2.7" ry="3.3" />
      <ellipse cx="15.2" cy="9.6" rx="2.7" ry="3.3" />
      <ellipse cx="9.1" cy="14.6" rx="2.3" ry="2.7" />
      <ellipse cx="14.9" cy="14.6" rx="2.3" ry="2.7" />
      <rect x="11.4" y="6.5" width="1.2" height="11" rx="0.6" fill="#4a7c3f" />
    </g>
  ),
};

export function DietIcon({ k, size = 22 }) {
  const d = DIETS.find((x) => x.key === k);
  if (!d) return null;
  return (
    <span
      className="diet"
      style={{ background: d.color, width: size, height: size }}
      title={d.label}
      aria-label={d.label}
      role="img"
    >
      <svg viewBox="0 0 24 24" width={Math.round(size * 0.74)} height={Math.round(size * 0.74)}>
        {GLYPHS[k]}
      </svg>
    </span>
  );
}

export function MenuKey() {
  return (
    <div className="menu__key" aria-label="Dietary key">
      <span className="menu__key-label">Key:</span>
      {DIETS.map((d) => (
        <span key={d.key} className="menu__key-item">
          <DietIcon k={d.key} size={20} />
          {d.label}
        </span>
      ))}
    </div>
  );
}
