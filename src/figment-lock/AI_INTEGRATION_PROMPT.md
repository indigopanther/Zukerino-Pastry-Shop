You are integrating the "Figment Lock" remote kill-switch into a client website.
This lets Figment Imaginative remotely show a "Locked by Figment" screen on the
site (e.g. for billing issues). Follow these rules exactly.

## The API (read-only, public, keyless)
- Endpoint: GET https://oightjxuugjsqcvuidnn.supabase.co/functions/v1/site-lock?site=<SITE_ID>
- No auth, no API key, no headers required. CORS is open. Never attach any
  Supabase key, token, or Authorization header — it is unnecessary and wrong.
- Response JSON:
    { "locked": true,  "title": "...", "message": "...", "phone": "..." }   // locked
    { "locked": false, "title": null,  "message": null,  "phone": null }    // live
- <SITE_ID> is the site's row id from the Figment admin (Sites → Manage →
  "One-time embed for this site"). Use the exact id Figment gives you. If the id
  is unknown/invalid, the endpoint returns locked:false.

## What this API can and cannot do
- It can ONLY READ one site's lock state. It returns nothing else.
- You CANNOT lock, unlock, list, or modify sites through it. Locking/unlocking is
  done only by a signed-in Figment admin in the dashboard (Sites → Manage) and is
  enforced by database row-level security. Do not attempt to write or call any
  other route.

## How to integrate (React + Vite — the normal case)
1. Place the provided `figment-lock/` folder in the project's `src/`.
2. In `src/main.jsx`, wrap the app root:
     import FigmentLock from './figment-lock/FigmentLock'
     createRoot(document.getElementById('root')).render(
       <FigmentLock siteId="<SITE_ID>"><App /></FigmentLock>
     )
   (Or set VITE_FIGMENT_SITE_ID=<SITE_ID> in .env and use <FigmentLock> with no prop.)
3. Do not modify the lock screen, the endpoint URL, the polling, or the
   fail-open logic. Do not add a way to bypass or disable the lock.

## Integration for a non-React / static site
Add one line before </body>:
  <script src="/figment-lock.js" data-site-id="<SITE_ID>" defer></script>

## Required behavior (do not change)
- Fail-open: if the check fails (offline/endpoint error), show the real site.
  Never default to locked.
- The component checks on load, every 60s, and on tab focus.
- When locked, the entire app is replaced by the lock screen.

## Verify your work
Ask Figment to lock the test site, then run:
  curl "https://oightjxuugjsqcvuidnn.supabase.co/functions/v1/site-lock?site=<SITE_ID>"
Confirm it returns locked:true with a title/message/phone, and that the running
site shows the lock screen within ~60s (immediately on reload). Then confirm it
returns to normal after Figment unlocks it.

## Hard don'ts
- Don't embed any Supabase key or secret in the client site.
- Don't try to lock/unlock programmatically — there is no public write path.
- Don't strip, comment out, or short-circuit FigmentLock.
- Don't cache the status aggressively; respect the no-store responses.
