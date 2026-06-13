import { business, reviews } from "../data";

const AVATAR_COLORS = ["#7c2235", "#a06f1f", "#3d6b4f", "#39557e", "#8a4f17", "#5d4a7e"];

function initials(name) {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function GoogleG({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
      />
    </svg>
  );
}

function Stars({ count = 5 }) {
  return (
    <span className="gstars" role="img" aria-label={`Rated ${count} out of 5 stars`}>
      {"★".repeat(count)}
    </span>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <div className="reviews__head reveal">
          <p className="eyebrow">Reviews</p>
          <h2 className="section-title">Loved by the neighborhood</h2>

          <div className="reviews__rating">
            <span className="reviews__score">5.0</span>
            <div className="reviews__rating-detail">
              <Stars />
              <span className="reviews__source">
                <GoogleG size={16} /> Google reviews
              </span>
            </div>
          </div>

          <a
            className="reviews__all"
            href={business.mapsLink}
            target="_blank"
            rel="noreferrer"
          >
            Read all reviews on Google →
          </a>
        </div>

        <div className="reviews__grid">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className="quote reveal"
              style={{ transitionDelay: `${(i % 3) * 90}ms` }}
            >
              <figcaption className="quote__top">
                <span
                  className="quote__avatar"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {initials(r.name)}
                </span>
                <span className="quote__meta">
                  <strong>{r.name}</strong>
                  <small>{r.date}</small>
                </span>
                <span className="quote__g" title="Posted on Google">
                  <GoogleG />
                </span>
              </figcaption>
              <Stars count={r.rating} />
              <blockquote>{r.text}</blockquote>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
