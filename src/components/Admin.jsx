import { useMemo, useState } from "react";
import { CATEGORIES } from "../menuData";
import { loadItems, saveItems, resetItems, exportDataFile } from "../menuStore";

const PIN = "30338";

function Gate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pin === PIN) {
      try { sessionStorage.setItem("zk_admin_ok", "1"); } catch { /* noop */ }
      onUnlock();
    } else {
      setErr(true);
      setPin("");
    }
  };

  return (
    <div className="adm__gate">
      <form className="adm__gate-card" onSubmit={submit}>
        <div className="adm__lock" aria-hidden="true">🔒</div>
        <h1>Menu Manager</h1>
        <p>Enter the PIN to manage the Zukerino menu.</p>
        <input
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => { setPin(e.target.value); setErr(false); }}
          placeholder="PIN"
          aria-label="PIN"
          className={err ? "is-error" : ""}
        />
        {err && <span className="adm__err">Wrong PIN — try again.</span>}
        <button type="submit" className="btn btn-primary">Unlock</button>
        <a href="#top" className="adm__back">← Back to site</a>
      </form>
    </div>
  );
}

export default function Admin() {
  const [ok, setOk] = useState(() => {
    try { return sessionStorage.getItem("zk_admin_ok") === "1"; } catch { return false; }
  });
  const [items, setItems] = useState(loadItems);
  const [filter, setFilter] = useState("All");
  const [saved, setSaved] = useState(false);

  const update = (id, field, value) => {
    const next = items.map((i) => (i.id === id ? { ...i, [field]: value } : i));
    setItems(next);
    saveItems(next);
    setSaved(true);
  };

  const stats = useMemo(() => ({
    total: items.length,
    named: items.filter((i) => i.name.trim()).length,
    featured: items.filter((i) => i.featured).length,
  }), [items]);

  const shown = filter === "All" ? items : items.filter((i) => i.category === filter);

  const download = () => {
    const blob = new Blob([exportDataFile(items)], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "menuData.js";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (window.confirm("Clear every name, price, description and featured mark? This cannot be undone.")) {
      resetItems();
      setItems(loadItems());
    }
  };

  if (!ok) return <Gate onUnlock={() => setOk(true)} />;

  return (
    <div className="adm">
      <header className="adm__bar">
        <div className="adm__bar-in container">
          <div className="adm__title">
            <strong>Zukerino</strong> Menu Manager
          </div>
          <div className="adm__progress">
            <span><b>{stats.named}</b>/{stats.total} named</span>
            <span><b>{stats.featured}</b> featured</span>
            <span className="adm__saved">{saved ? "Saved ✓" : "Auto-saves"}</span>
          </div>
          <div className="adm__actions">
            <a href="#top" className="btn btn-ghost adm__btn">View site</a>
            <button onClick={download} className="btn btn-primary adm__btn">Download data file</button>
          </div>
        </div>
      </header>

      <div className="container adm__body">
        <p className="adm__help">
          Look at each photo and fill in its <b>name</b>, <b>price</b>, and a short
          <b> description</b>. Tick <b>Featured</b> to spotlight it on the site. Changes
          save automatically in this browser. When you're done, click
          <b> Download data file</b> and send it to whoever updates the website to make
          it live for everyone.
        </p>

        <div className="adm__filters">
          <button className={`adm__chip ${filter === "All" ? "is-active" : ""}`} onClick={() => setFilter("All")}>
            All ({items.length})
          </button>
          {CATEGORIES.map((c) => {
            const n = items.filter((i) => i.category === c).length;
            if (!n) return null;
            return (
              <button key={c} className={`adm__chip ${filter === c ? "is-active" : ""}`} onClick={() => setFilter(c)}>
                {c} ({n})
              </button>
            );
          })}
        </div>

        <div className="adm__grid">
          {shown.map((it) => (
            <div key={it.id} className={`adm__card ${it.featured ? "is-featured" : ""} ${it.name.trim() ? "is-done" : ""}`}>
              <div className="adm__photo">
                <img src={it.img} alt="" loading="lazy" />
              </div>
              <div className="adm__fields">
                <input
                  className="adm__name"
                  value={it.name}
                  onChange={(e) => update(it.id, "name", e.target.value)}
                  placeholder="Item name…"
                />
                <div className="adm__line">
                  <input
                    className="adm__price"
                    value={it.price}
                    onChange={(e) => update(it.id, "price", e.target.value)}
                    placeholder="Price (e.g. $6.50)"
                  />
                  <select
                    className="adm__cat"
                    value={it.category}
                    onChange={(e) => update(it.id, "category", e.target.value)}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea
                  className="adm__desc"
                  rows={2}
                  value={it.desc}
                  onChange={(e) => update(it.id, "desc", e.target.value)}
                  placeholder="Short description…"
                />
                <label className="adm__feat">
                  <input
                    type="checkbox"
                    checked={it.featured}
                    onChange={(e) => update(it.id, "featured", e.target.checked)}
                  />
                  <span>★ Featured</span>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="adm__foot">
          <button onClick={reset} className="adm__reset">Reset everything</button>
        </div>
      </div>
    </div>
  );
}
