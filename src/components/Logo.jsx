import { useId } from "react";

/*
 * Zukerino Pastry Shop wordmark — a vector recreation of the storefront sign:
 * striped slab-serif "ZUKERINO" over rust-orange "PASTRY SHOP", on a signboard
 * panel, with an optional tagline.
 */
export default function Logo({ tagline = false, className = "" }) {
  const raw = useId();
  const pid = `zukStripe-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const h = tagline ? 208 : 170;

  return (
    <svg
      className={`logo ${className}`}
      viewBox={`0 0 640 ${h}`}
      role="img"
      aria-label="Zukerino Pastry Shop"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={pid} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#241612" />
          <rect width="10" height="2.6" fill="#f7efe0" />
        </pattern>
      </defs>

      {/* signboard panel */}
      <rect
        x="3"
        y="3"
        width="634"
        height={h - 6}
        rx="16"
        fill="#fdfaf2"
        stroke="#241612"
        strokeWidth="5"
      />
      <rect
        x="15"
        y="15"
        width="610"
        height={h - 30}
        rx="9"
        fill="none"
        stroke="#241612"
        strokeWidth="1.5"
        opacity="0.45"
      />

      {/* ZUKERINO */}
      <text
        x="320"
        y="96"
        textAnchor="middle"
        textLength="556"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="'Alfa Slab One', Georgia, serif"
        fontSize="84"
        fill={`url(#${pid})`}
      >
        ZUKERINO
      </text>

      {/* PASTRY SHOP */}
      <text
        x="320"
        y="148"
        textAnchor="middle"
        textLength="372"
        lengthAdjust="spacingAndGlyphs"
        fontFamily="'Alfa Slab One', Georgia, serif"
        fontSize="38"
        fill="#cf5f1e"
      >
        PASTRY SHOP
      </text>

      {tagline && (
        <text
          x="320"
          y="190"
          textAnchor="middle"
          textLength="540"
          lengthAdjust="spacingAndGlyphs"
          fontFamily="'Jost', sans-serif"
          fontWeight="600"
          fontSize="16"
          letterSpacing="0.5"
          fill="#241612"
        >
          PASTRIES FOR ALL OCCASIONS ◆ WE KNOW HOW TO DISPLAY TASTE
        </text>
      )}
    </svg>
  );
}
