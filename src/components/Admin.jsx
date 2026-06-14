import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, DIETS } from "../menuData";
import { DietIcon } from "../diet";
import {
  loadItems,
  fetchItems,
  saveItems,
  resetItems,
  exportDataFile,
  setAdminPin,
  subscribeStatus,
} from "../menuStore";

const PIN = "30338";

function Gate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (pin === PIN) {
      try { sessionStorage.setItem("zk_admin_ok", "1"); } catch { /* noop */ }
      setAdminPin(pin); // needed to authorize saves to the live menu
      onUnlock();
    } else {
      setErr(true);
      setPin("");
    }
  };

  return (
    <div className="adm__gate">
      <form className="adm__gate-card" onSubmit={submit}>
        <img className="adm__gate-logo" src="/assets/zukerino-dark.png" alt="Zukerino" />
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
  const [status, setStatus] = useState("idle");

  // Pull the current published menu from Supabase, and reflect save status.
  useEffect(() => {
    let alive = true;
    fetchItems().then((srv) => { if (alive) setItems(srv); });
    const unsub = subscribeStatus(setStatus);
    return () => { alive = false; unsub(); };
  }, []);

  const update = (id, field, value) => {
    const next = items.map((i) => (i.id === id ? { ...i, [field]: value } : i));
    setItems(next);
    saveItems(next); // optimistic + debounced publish to the live menu
  };

  const toggleDiet = (id, key) => {
    const it = items.find((i) => i.id === id);
    const has = it.diets.includes(key);
    update(id, "diets", has ? it.diets.filter((d) => d !== key) : [...it.diets, key]);
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

  const reset = async () => {
    if (window.confirm("Clear every name, price, description and featured mark for ALL visitors? This cannot be undone.")) {
      const items = await resetItems();
      setItems(items);
    }
  };

  const statusLabel =
    status === "saving" ? "Saving…" :
    status === "saved" ? "Saved ✓ · live" :
    status === "error" ? "Save failed — retry" :
    "Edits save live";

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
            <span className={`adm__saved ${status === "error" ? "is-error" : ""}`}>{statusLabel}</span>
          </div>
          <div className="adm__actions">
            <a href="#top" className="btn btn-ghost adm__btn">View site</a>
            <button onClick={download} className="btn btn-ghost adm__btn">Backup file</button>
          </div>
        </div>
      </header>

      <div className="container adm__body">
        <p className="adm__help">
          Look at each photo and fill in its <b>name</b>, <b>price</b>, and a short
          <b> description</b>. Tick <b>Featured</b> to spotlight it on the site.
          Every change <b>saves automatically and goes live on the website for everyone</b> —
          there's nothing to send to anyone. The <b>Backup file</b> button is optional, just
          for keeping your own copy.
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
                <div className="adm__diets">
                  {DIETS.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      className={`adm__diet ${it.diets.includes(d.key) ? "is-on" : ""}`}
                      onClick={() => toggleDiet(it.id, d.key)}
                      aria-pressed={it.diets.includes(d.key)}
                    >
                      <DietIcon k={d.key} size={16} />
                      {d.label}
                    </button>
                  ))}
                </div>
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
