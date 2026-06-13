// Tiny store for the editable menu. Persists to localStorage and lets the admin
// page and the public menu stay in sync (same tab + across tabs).
// "I don't care about security" — the PIN gate and this storage are client-side
// only; edits live in the owner's browser until exported and published.

import { DEFAULT_ITEMS } from "./menuData";

const KEY = "zukerino_menu_v1";
const EVT = "zukerino-menu-change";

// Merge saved edits onto the default list (by id), keeping default order and
// always using the bundled photo. New photos added to menuData later show up
// automatically; removed ones drop out.
function merge(saved) {
  const map = new Map((saved || []).map((i) => [i.id, i]));
  return DEFAULT_ITEMS.map((d) => {
    const s = map.get(d.id) || {};
    return {
      ...d,
      name: s.name ?? "",
      price: s.price ?? "",
      desc: s.desc ?? "",
      featured: !!s.featured,
      category: s.category || d.category,
    };
  });
}

export function loadItems() {
  if (typeof localStorage === "undefined") return merge(null);
  try {
    return merge(JSON.parse(localStorage.getItem(KEY)));
  } catch {
    return merge(null);
  }
}

export function saveItems(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore quota/availability errors */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: items }));
}

export function resetItems() {
  try {
    localStorage.removeItem(KEY);
  } catch { /* noop */ }
  window.dispatchEvent(new CustomEvent(EVT, { detail: merge(null) }));
}

export function subscribe(cb) {
  const onLocal = (e) => cb(e.detail || loadItems());
  const onStorage = (e) => {
    if (e.key === KEY) cb(loadItems());
  };
  window.addEventListener(EVT, onLocal);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVT, onLocal);
    window.removeEventListener("storage", onStorage);
  };
}

// Produce a ready-to-commit src/menuData.js so edits can be published for
// everyone (drop this file into the repo, redeploy).
export function exportDataFile(items) {
  const rows = items
    .map(
      (i) =>
        `  { id: ${JSON.stringify(i.id)}, img: ${JSON.stringify(i.img)}, ` +
        `name: ${JSON.stringify(i.name)}, price: ${JSON.stringify(i.price)}, ` +
        `desc: ${JSON.stringify(i.desc)}, featured: ${i.featured ? "true" : "false"}, ` +
        `category: ${JSON.stringify(i.category)} },`
    )
    .join("\n");
  return (
    `// Published Zukerino menu. Edited via /#admin and exported on ${new Date().toLocaleString()}.\n\n` +
    `export const CATEGORIES = [\n` +
    `  "Cakes", "Cheesecakes", "Baklava", "Cookies", "Gluten Free",\n` +
    `  "Pastries", "Party Trays", "Pies", "Other",\n];\n\n` +
    `export const DEFAULT_ITEMS = [\n${rows}\n];\n`
  );
}
