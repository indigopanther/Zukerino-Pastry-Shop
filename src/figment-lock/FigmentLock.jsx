import { useEffect, useRef, useState } from 'react'

/* ============================================================
 * FigmentLock — remote kill-switch for client sites.
 *
 * Drop this `figment-lock/` folder into a client project's src/
 * and wrap the app:
 *
 *   import FigmentLock from './figment-lock/FigmentLock'
 *
 *   createRoot(document.getElementById('root')).render(
 *     <FigmentLock siteId="00000000-0000-0000-0000-000000000000">
 *       <App />
 *     </FigmentLock>
 *   )
 *
 * `siteId` is the site's row id from the Figment admin (Sites → Manage,
 * "One-time embed for this site" — already filled in for you there).
 *
 * On load (and every 60s) it asks Figment's public endpoint whether this site
 * is locked. If it is, the entire app is replaced with the lock screen.
 * Nothing secret ships here — the endpoint is keyless and only ever returns
 * this one site's lock state.
 *
 * Fail-open: if the check can't complete (offline, endpoint down), the real
 * site is shown. A backend hiccup never blacks out the site.
 * ============================================================ */

// Figment Imaginative control endpoint (publishable — safe to commit).
const DEFAULT_ENDPOINT =
  'https://oightjxuugjsqcvuidnn.supabase.co/functions/v1/site-lock'

const FIGMENT_URL = 'https://www.figmentimaginative.com'

export default function FigmentLock({
  siteId,
  endpoint = DEFAULT_ENDPOINT,
  pollMs = 60000,
  children,
}) {
  const id = siteId || (import.meta?.env?.VITE_FIGMENT_SITE_ID ?? '').trim()

  // 'loading' | 'active' | 'locked'  (loading & active both render the site)
  // No id -> start (and stay) 'active' so a misconfig never locks a site.
  const [state, setState] = useState(id ? 'loading' : 'active')
  const [lock, setLock] = useState(null)
  const timer = useRef(null)

  useEffect(() => {
    if (!id) {
      console.warn('[FigmentLock] no siteId provided; skipping lock check.')
      return
    }
    let alive = true

    const check = async () => {
      try {
        const res = await fetch(
          `${endpoint}?site=${encodeURIComponent(id)}&t=${Date.now()}`,
          { cache: 'no-store' },
        )
        if (!res.ok) throw new Error(`status ${res.status}`)
        const data = await res.json()
        if (!alive) return
        if (data.locked) {
          setLock({
            title: data.title || 'Website Unavailable',
            message: data.message || '',
            phone: data.phone || '',
          })
          setState('locked')
        } else {
          setState('active')
        }
      } catch {
        // Fail-open.
        if (alive) setState((s) => (s === 'locked' ? 'locked' : 'active'))
      }
    }

    check()
    timer.current = setInterval(check, pollMs)
    const onFocus = () => check()
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      alive = false
      clearInterval(timer.current)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [id, endpoint, pollMs])

  // Stop the page behind the lock from scrolling.
  useEffect(() => {
    if (state !== 'locked') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [state])

  if (state === 'locked') return <LockScreen {...lock} />
  return children
}

function LockScreen({ title, message, phone }) {
  const tel = (phone || '').replace(/[^+\d]/g, '')
  return (
    <div className="figlock-overlay" role="dialog" aria-modal="true" aria-label={title || 'Locked'}>
      <style>{LOCK_CSS}</style>
      <div className="figlock-card">
        <div className="figlock-badge">
          <svg className="figlock-icon" width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" />
            <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" />
            <circle cx="12" cy="15.2" r="1.3" />
            <path d="M12 16.5v1.8" />
          </svg>
        </div>

        <h1 className="figlock-title figlock-fade" style={{ animationDelay: '.18s' }}>
          {title || 'Website Unavailable'}
        </h1>

        {message && (
          <p className="figlock-msg figlock-fade" style={{ animationDelay: '.26s' }}>{message}</p>
        )}

        {phone && (
          <a className="figlock-phone figlock-fade" style={{ animationDelay: '.34s' }} href={`tel:${tel}`}>
            {phone}
          </a>
        )}

        <div className="figlock-fade" style={{ animationDelay: '.42s' }}>
          <a className="figlock-btn" href={FIGMENT_URL} target="_blank" rel="noopener noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="M11 6l-6 6 6 6" />
            </svg>
            Back to Figment
          </a>
        </div>
      </div>
    </div>
  )
}

// Self-contained styles + animations. Everything is prefixed `figlock-` so it
// can't collide with the host site's CSS. Text sits on a solid card so the
// striped background never hurts readability. Respects reduced-motion.
const LOCK_CSS = `
.figlock-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;
 background-color:#FDFBD4;background-image:repeating-linear-gradient(45deg,#FDFBD4 0,#FDFBD4 26px,#F1ECB2 26px,#F1ECB2 52px);
 animation:figlock-stripes 3.8s linear infinite;
 font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;}
.figlock-card{position:relative;box-sizing:border-box;width:100%;max-width:440px;text-align:center;
 background:linear-gradient(180deg,#ffffff 0%,#FDFCF4 100%);border:2px solid #141202;border-radius:24px;
 box-shadow:9px 9px 0 #141202;padding:40px 30px 34px;animation:figlock-rise .6s cubic-bezier(.22,1,.36,1) both;}
.figlock-badge{position:relative;width:84px;height:84px;margin:0 auto 22px;border:2px solid #141202;border-radius:20px;
 background:linear-gradient(180deg,#ffffff,#F2EFDD);box-shadow:4px 4px 0 #141202,inset 0 2px 0 rgba(255,255,255,.85);
 display:flex;align-items:center;justify-content:center;animation:figlock-badge .65s .1s cubic-bezier(.34,1.56,.64,1) both;}
.figlock-badge::after{content:"";position:absolute;inset:-9px;border-radius:27px;border:2px solid rgba(46,111,64,.5);
 animation:figlock-ring 2.4s ease-out infinite;}
.figlock-icon{color:#141202;transform-origin:50% 28%;animation:figlock-sway 3.4s ease-in-out infinite;}
.figlock-title{margin:0 0 12px;font-family:'Fraunces',Georgia,'Times New Roman',serif;font-weight:800;
 font-size:1.7rem;line-height:1.16;letter-spacing:-.01em;color:#171410;}
.figlock-msg{margin:0 auto 22px;max-width:360px;font-size:1rem;line-height:1.6;color:#5C5A45;}
.figlock-phone{display:inline-block;margin:0 0 26px;font-size:1.2rem;font-weight:700;color:#171410;
 text-decoration:none;border-bottom:2px solid rgba(46,111,64,.55);padding-bottom:2px;}
.figlock-btn{--pop:#141202;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-weight:700;
 font-size:1rem;line-height:1;border-radius:.7rem;padding:.8rem 1.5rem;cursor:pointer;text-decoration:none;
 border:2px solid var(--pop);color:#fff;background:linear-gradient(180deg,#4D9C63 0%,#3A8750 38%,#2E6F40 100%);
 box-shadow:3px 3px 0 var(--pop),inset 0 1.5px 0 rgba(255,255,255,.45),inset 0 -8px 14px rgba(0,0,0,.22);
 transition:transform .15s ease,box-shadow .15s ease,filter .15s ease;}
.figlock-btn:hover{transform:translate(-1px,-1px);filter:brightness(1.06);
 box-shadow:5px 5px 0 var(--pop),inset 0 1.5px 0 rgba(255,255,255,.5),inset 0 -8px 14px rgba(0,0,0,.22);}
.figlock-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--pop),inset 0 2px 8px rgba(0,0,0,.28);}
.figlock-fade{opacity:0;animation:figlock-fade .5s ease-out forwards;}
@keyframes figlock-stripes{from{background-position:0 0}to{background-position:73.54px 0}}
@keyframes figlock-rise{0%{opacity:0;transform:translateY(18px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
@keyframes figlock-badge{0%{opacity:0;transform:scale(.5) rotate(-8deg)}100%{opacity:1;transform:scale(1) rotate(0)}}
@keyframes figlock-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}
@keyframes figlock-ring{0%{transform:scale(.92);opacity:.7}100%{transform:scale(1.25);opacity:0}}
@keyframes figlock-fade{to{opacity:1}}
@media (prefers-reduced-motion:reduce){
 .figlock-overlay,.figlock-card,.figlock-badge,.figlock-icon,.figlock-badge::after,.figlock-fade{animation:none!important}
 .figlock-fade{opacity:1!important}}
`
