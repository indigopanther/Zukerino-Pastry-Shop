/* ============================================================
 * figment-lock.js — framework-agnostic version of the kill-switch.
 * For client sites that are NOT React (plain HTML, etc.).
 *
 * Usage: drop this file in the site and add ONE line before </body>:
 *
 *   <script src="/figment-lock.js" data-site-id="<SITE-ID>" defer></script>
 *
 * <SITE-ID> is the site's row id from the Figment admin (Sites → Manage).
 * On load (and every 60s) it asks Figment's public endpoint whether this
 * site is locked; if so it covers the page with the animated lock screen.
 * Keyless and fail-open — a backend hiccup never locks the site.
 * ============================================================ */
(function () {
  var ENDPOINT =
    'https://oightjxuugjsqcvuidnn.supabase.co/functions/v1/site-lock'
  var FIGMENT_URL = 'https://www.figmentimaginative.com'
  var OVERLAY_ID = '__figment_lock__'
  var STYLE_ID = '__figment_lock_style__'

  var script = document.currentScript
  var siteId =
    (script && script.getAttribute('data-site-id')) ||
    window.FIGMENT_SITE_ID ||
    ''
  siteId = String(siteId).trim()

  if (!siteId) {
    console.warn('[FigmentLock] no data-site-id set; skipping lock check.')
    return
  }

  // Self-contained styles + animations. Prefixed `figlock-` so they can't
  // collide with the host site. Text sits on a solid card for readability.
  var CSS = [
    ".figlock-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:24px;",
    " background-color:#FDFBD4;background-image:repeating-linear-gradient(45deg,#FDFBD4 0,#FDFBD4 26px,#F1ECB2 26px,#F1ECB2 52px);",
    " animation:figlock-stripes 3.8s linear infinite;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}",
    ".figlock-card{position:relative;box-sizing:border-box;width:100%;max-width:440px;text-align:center;",
    " background:linear-gradient(180deg,#fff 0%,#FDFCF4 100%);border:2px solid #141202;border-radius:24px;",
    " box-shadow:9px 9px 0 #141202;padding:40px 30px 34px;animation:figlock-rise .6s cubic-bezier(.22,1,.36,1) both}",
    ".figlock-badge{position:relative;width:84px;height:84px;margin:0 auto 22px;border:2px solid #141202;border-radius:20px;",
    " background:linear-gradient(180deg,#fff,#F2EFDD);box-shadow:4px 4px 0 #141202,inset 0 2px 0 rgba(255,255,255,.85);",
    " display:flex;align-items:center;justify-content:center;animation:figlock-badge .65s .1s cubic-bezier(.34,1.56,.64,1) both}",
    ".figlock-badge::after{content:'';position:absolute;inset:-9px;border-radius:27px;border:2px solid rgba(46,111,64,.5);animation:figlock-ring 2.4s ease-out infinite}",
    ".figlock-icon{color:#141202;transform-origin:50% 28%;animation:figlock-sway 3.4s ease-in-out infinite}",
    ".figlock-title{margin:0 0 12px;font-family:'Fraunces',Georgia,'Times New Roman',serif;font-weight:800;font-size:1.7rem;line-height:1.16;letter-spacing:-.01em;color:#171410}",
    ".figlock-msg{margin:0 auto 22px;max-width:360px;font-size:1rem;line-height:1.6;color:#5C5A45}",
    ".figlock-phone{display:inline-block;margin:0 0 26px;font-size:1.2rem;font-weight:700;color:#171410;text-decoration:none;border-bottom:2px solid rgba(46,111,64,.55);padding-bottom:2px}",
    ".figlock-btn{--pop:#141202;display:inline-flex;align-items:center;justify-content:center;gap:.5rem;font-weight:700;font-size:1rem;line-height:1;",
    " border-radius:.7rem;padding:.8rem 1.5rem;cursor:pointer;text-decoration:none;border:2px solid var(--pop);color:#fff;",
    " background:linear-gradient(180deg,#4D9C63 0%,#3A8750 38%,#2E6F40 100%);",
    " box-shadow:3px 3px 0 var(--pop),inset 0 1.5px 0 rgba(255,255,255,.45),inset 0 -8px 14px rgba(0,0,0,.22);transition:transform .15s ease,box-shadow .15s ease,filter .15s ease}",
    ".figlock-btn:hover{transform:translate(-1px,-1px);filter:brightness(1.06);box-shadow:5px 5px 0 var(--pop),inset 0 1.5px 0 rgba(255,255,255,.5),inset 0 -8px 14px rgba(0,0,0,.22)}",
    ".figlock-btn:active{transform:translate(2px,2px);box-shadow:1px 1px 0 var(--pop),inset 0 2px 8px rgba(0,0,0,.28)}",
    ".figlock-fade{opacity:0;animation:figlock-fade .5s ease-out forwards}",
    "@keyframes figlock-stripes{from{background-position:0 0}to{background-position:73.54px 0}}",
    "@keyframes figlock-rise{0%{opacity:0;transform:translateY(18px) scale(.97)}100%{opacity:1;transform:translateY(0) scale(1)}}",
    "@keyframes figlock-badge{0%{opacity:0;transform:scale(.5) rotate(-8deg)}100%{opacity:1;transform:scale(1) rotate(0)}}",
    "@keyframes figlock-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}",
    "@keyframes figlock-ring{0%{transform:scale(.92);opacity:.7}100%{transform:scale(1.25);opacity:0}}",
    "@keyframes figlock-fade{to{opacity:1}}",
    "@media (prefers-reduced-motion:reduce){.figlock-overlay,.figlock-card,.figlock-badge,.figlock-icon,.figlock-badge::after,.figlock-fade{animation:none!important}.figlock-fade{opacity:1!important}}",
  ].join('')

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]
    })
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return
    var st = document.createElement('style')
    st.id = STYLE_ID
    st.textContent = CSS
    document.head.appendChild(st)
  }

  function showLock(info) {
    if (document.getElementById(OVERLAY_ID)) return
    injectStyle()
    var tel = (info.phone || '').replace(/[^+\d]/g, '')
    var el = document.createElement('div')
    el.id = OVERLAY_ID
    el.className = 'figlock-overlay'
    el.setAttribute('role', 'dialog')
    el.setAttribute('aria-modal', 'true')
    el.innerHTML =
      '<div class="figlock-card">' +
        '<div class="figlock-badge">' +
          '<svg class="figlock-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4.5" y="10.5" width="15" height="10" rx="2.2"/>' +
            '<path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>' +
            '<circle cx="12" cy="15.2" r="1.3"/>' +
            '<path d="M12 16.5v1.8"/>' +
          '</svg>' +
        '</div>' +
        '<h1 class="figlock-title figlock-fade" style="animation-delay:.18s">' + esc(info.title || 'Website Unavailable') + '</h1>' +
        (info.message
          ? '<p class="figlock-msg figlock-fade" style="animation-delay:.26s">' + esc(info.message) + '</p>'
          : '') +
        (info.phone
          ? '<a class="figlock-phone figlock-fade" style="animation-delay:.34s" href="tel:' + esc(tel) + '">' + esc(info.phone) + '</a>'
          : '') +
        '<div class="figlock-fade" style="animation-delay:.42s">' +
          '<a class="figlock-btn" href="' + FIGMENT_URL + '" target="_blank" rel="noopener noreferrer">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>' +
            '</svg>' +
            'Back to Figment' +
          '</a>' +
        '</div>' +
      '</div>'
    document.body.appendChild(el)
    document.body.style.overflow = 'hidden'
  }

  function hideLock() {
    var el = document.getElementById(OVERLAY_ID)
    if (el) el.parentNode.removeChild(el)
    document.body.style.overflow = ''
  }

  function check() {
    fetch(ENDPOINT + '?site=' + encodeURIComponent(siteId) + '&t=' + Date.now(), { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('status ' + r.status)
        return r.json()
      })
      .then(function (data) {
        if (data && data.locked) showLock(data)
        else hideLock()
      })
      .catch(function () {
        /* fail-open: leave the site as-is */
      })
  }

  check()
  setInterval(check, 60000)
  window.addEventListener('focus', check)
  document.addEventListener('visibilitychange', check)
})()
