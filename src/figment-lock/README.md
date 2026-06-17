# Figment Lock — remote site kill-switch

Lets Figment Imaginative remotely **lock** a client site (replace it with a
"Website Unavailable" screen) and **unlock** it, straight from the Studio admin:
**Sites → Manage → Live site lock**. The client site checks its status on load
and every 60s.

## How it fits together

```
  Figment admin (Sites → Manage)             Client site (this kit)
  ── Lock / Unlock ──►  sites.locked  ◄── reads ──  site-lock Edge Function
        (admin login,        (one flag           (public, keyless GET)
         RLS-protected)       per site)
```

- **Publishable:** the client only ever calls the public `site-lock` endpoint
  with its own site id. No keys, tokens, or secrets ship in the client site.
- **Not hackable:** the endpoint is **read-only** and returns just one site's
  lock state. Locking/unlocking requires a logged-in Figment admin (enforced by
  Postgres Row Level Security on `sites`) — there is no public write path.
- **Fail-open:** if the check can't complete (offline / endpoint down), the
  real site shows. An outage never blacks out every client at once.

## Setup (React + Vite — the usual case)

1. Copy this whole `figment-lock/` folder into the client project's `src/`.
2. Wrap the app root in `src/main.jsx` (the admin gives you the exact snippet
   with the id already filled in — Sites → Manage → "One-time embed for this site"):

```jsx
import FigmentLock from './figment-lock/FigmentLock'

createRoot(document.getElementById('root')).render(
  <FigmentLock siteId="00000000-0000-0000-0000-000000000000">
    <App />
  </FigmentLock>
)
```

That's it. Deploy the client site once with this in place, and from then on you
lock/unlock it entirely from the Figment admin — no client redeploy needed.

### Optional: id via env var

Instead of a prop you can set `VITE_FIGMENT_SITE_ID=<site-id>` in the client's
`.env` and use `<FigmentLock>` with no prop.

## Setup (non-React / plain HTML sites)

Add one line before `</body>`:

```html
<script src="/figment-lock.js" data-site-id="<SITE-ID>" defer></script>
```

(Place `figment-lock.js` somewhere served at the site root, or adjust the path.)

## The lock screen

Full-white screen with a lock icon, **Website Unavailable**, the message,
your phone number, and a link back to https://www.figmentimaginative.com:

> **Website Unavailable**
> Due to an error, this website is currently unavailable. Please check back shortly.
> Please call 678-920-2287 for assistance.

The wording lives server-side in the `site-lock` Edge Function, so it's
identical on every client and changing it once updates them all.

## Testing

Lock a test site in the admin, then:

```bash
curl "https://oightjxuugjsqcvuidnn.supabase.co/functions/v1/site-lock?site=YOUR-SITE-ID"
# locked  → {"locked":true,"title":"...","message":"...","phone":"..."}
# active  → {"locked":false,"title":null,"message":null,"phone":null}
```

## Notes & limits

- The check is client-side, so it only works on builds that include this kit.
  Because Figment controls each client's deploy pipeline, a client can't strip
  it out and redeploy on their own.
- A locked site may flash for a moment before the first check resolves; this is
  intentional (fail-open prioritizes the normal, active case).
- Locking takes effect within ~60s on already-open tabs, immediately on reload.
