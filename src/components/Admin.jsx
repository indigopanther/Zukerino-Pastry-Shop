import { useEffect, useMemo, useRef, useState } from "react";
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
  addItem,
  deleteItem,
} from "../menuStore";

const PIN = "30338";

// Downscale + compress a chosen photo before upload so it loads fast on the
// site and stays well within the upload size limit (matches the imported look).
function compressImage(file, maxDim = 1400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode failed"));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const EMPTY_DRAFT = {
  name: "",
  price: "",
  category: CATEGORIES[0],
  desc: "",
  diets: [],
  featured: false,
};

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

  // Add-product form state
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [draftImg, setDraftImg] = useState("");
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState("");
  const fileRef = useRef(null);

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

  /* ---- add a new product ---- */
  const pickImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAddErr("");
    try {
      setDraftImg(await compressImage(file));
    } catch {
      setAddErr("Couldn't read that image — please try another photo.");
    }
  };

  const toggleDraftDiet = (key) =>
    setDraft((d) => ({
      ...d,
      diets: d.diets.includes(key)
        ? d.diets.filter((k) => k !== key)
        : [...d.diets, key],
    }));

  const resetDraft = () => {
    setDraft(EMPTY_DRAFT);
    setDraftImg("");
    setAddErr("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    if (!draftImg) return setAddErr("Add a photo first.");
    if (!draft.name.trim()) return setAddErr("Give the product a name.");
    setAdding(true);
    setAddErr("");
    try {
      const next = await addItem({ ...draft, name: draft.name.trim() }, draftImg);
      setItems(next);
      resetDraft();
      setShowAdd(false);
    } catch (err) {
      setAddErr(err?.message ? `Couldn't add — ${err.message}` : "Couldn't add — please try again.");
    } finally {
      setAdding(false);
    }
  };

  /* ---- delete a product ---- */
  const removeItem = async (it) => {
    const label = it.name?.trim() || "this product";
    if (!window.confirm(`Delete "${label}"? This removes it from the website for everyone and can't be undone.`)) return;
    const next = await deleteItem(it.id);
    setItems(next);
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
            <button onClick={() => setShowAdd((s) => !s)} className="btn btn-primary adm__btn">+ Add product</button>
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

        {showAdd && (
          <form className="adm__add" onSubmit={submitAdd}>
            <div className="adm__add-head">
              <h2>Add a product</h2>
              <button type="button" className="adm__add-x" onClick={() => { setShowAdd(false); resetDraft(); }} aria-label="Close">×</button>
            </div>
            <div className="adm__add-body">
              <label className="adm__drop">
                {draftImg
                  ? <img src={draftImg} alt="Selected product" />
                  : <span>Tap to add a photo<br /><small>JPG or PNG</small></span>}
                <input ref={fileRef} type="file" accept="image/*" onChange={pickImage} hidden />
              </label>
              <div className="adm__add-fields">
                <input
                  className="adm__name"
                  value={draft.name}
                  onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                  placeholder="Item name…"
                />
                <div className="adm__line">
                  <input
                    className="adm__price"
                    value={draft.price}
                    onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                    placeholder="Price (e.g. $6.50)"
                  />
                  <select
                    className="adm__cat"
                    value={draft.category}
                    onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea
                  className="adm__desc"
                  rows={2}
                  value={draft.desc}
                  onChange={(e) => setDraft((d) => ({ ...d, desc: e.target.value }))}
                  placeholder="Short description…"
                />
                <div className="adm__diets">
                  {DIETS.map((d) => (
                    <button
                      key={d.key}
                      type="button"
                      className={`adm__diet ${draft.diets.includes(d.key) ? "is-on" : ""}`}
                      onClick={() => toggleDraftDiet(d.key)}
                      aria-pressed={draft.diets.includes(d.key)}
                    >
                      <DietIcon k={d.key} size={16} />
                      {d.label}
                    </button>
                  ))}
                </div>
                <label className="adm__feat">
                  <input
                    type="checkbox"
                    checked={draft.featured}
                    onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))}
                  />
                  <span>★ Featured</span>
                </label>
                {addErr && <span className="adm__err">{addErr}</span>}
                <div className="adm__add-actions">
                  <button type="button" className="btn btn-ghost adm__btn" onClick={() => { setShowAdd(false); resetDraft(); }} disabled={adding}>Cancel</button>
                  <button type="submit" className="btn btn-primary adm__btn" disabled={adding}>{adding ? "Adding…" : "Add product"}</button>
                </div>
              </div>
            </div>
          </form>
        )}

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
                <button
                  type="button"
                  className="adm__del"
                  onClick={() => removeItem(it)}
                  aria-label="Delete product"
                  title="Delete this product"
                >
                  Delete
                </button>
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
