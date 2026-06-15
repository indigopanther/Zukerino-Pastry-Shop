# Rolling Figment Lock out to client sites

There are two ways to add the lock to a React + Vite client site. The hosted
one-liner is the recommended default — it's one line, needs no file copying or
`main.jsx` surgery, and design/message changes propagate to every site with no
client redeploy.

---

## Method A (recommended) — hosted script, one line per site

The lock script is hosted on your own site at
`https://www.figmentimaginative.com/figment-lock.js` (served from this repo's
`public/figment-lock.js`). Each client site just references it.

**One-time:** deploy figmentimaginative.com so the script is live at that URL.

**Per client site:** add ONE line before `</body>` in the project's
`index.html`, using that site's id from Admin → Sites → Manage:

```html
<script src="https://www.figmentimaginative.com/figment-lock.js" data-site-id="PASTE-SITE-ID" defer></script>
```

Commit + push that one site. Done — lock/unlock from Sites → Manage forever.

- Leave `data-site-id` empty and the site behaves normally (fail-open).
- Update the lock's look or wording once (edit `public/figment-lock.js` + the
  Edge Function copy, redeploy figmentimaginative.com) and **every** client
  site updates automatically — no per-site redeploy.
- If a client site sets a strict Content-Security-Policy, allow
  `https://www.figmentimaginative.com` in `script-src` and
  `https://oightjxuugjsqcvuidnn.supabase.co` in `connect-src`.

### Bake into the `/build` skill
Add to the step that writes `index.html`: include the script tag above with an
empty `data-site-id=""`. New sites then ship lock-ready and dormant; arming a
site is just pasting its id into that attribute and redeploying.

---

## Method B — bundled React component (maximum strength)

Use this when you want the lock to fully replace the app (not just overlay it).
It ships inside the client bundle.

1. Copy the kit into the project's `src/` (first time only — re-copying a
   second time nests it; use `cp -R ".../figment-lock/." src/figment-lock/` to
   resync in place):
   ```bash
   cp -R "../Figment Imaginative/figment-lock" src/figment-lock
   ```
2. In `src/main.jsx`, wrap the app — make sure there is exactly ONE
   `createRoot(...).render(...)` (delete the original un-wrapped one):
   ```jsx
   import FigmentLock from './figment-lock/FigmentLock'

   ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
       <FigmentLock siteId="PASTE-SITE-ID">
         <App />
       </FigmentLock>
     </React.StrictMode>
   )
   ```
3. Commit + push.

Trade-off: Method B fully swaps out the app but design changes require copying
the updated `FigmentLock.jsx` into each repo and redeploying. Method A overlays
the app and updates everywhere centrally.
