const PHRASES = [
  "Family Owned",
  "Baked Fresh Daily",
  "Wholesale & Retail",
  "Custom Cakes by Phone Request",
  "Greek & Italian",
  "Since Day One",
];

export default function Marquee() {
  const run = PHRASES.concat(PHRASES);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {run.map((p, i) => (
          <span key={i}>{p}</span>
        ))}
      </div>
    </div>
  );
}
