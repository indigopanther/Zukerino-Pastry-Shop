// Live menu store for Zukerino Pastry Shop.
//
// Source of truth is a Supabase table (public read). The owner edits on /#admin;
// those edits are saved through a PIN-protected edge function and instantly go
// live for every visitor — no file to export or send to anyone.
//
// localStorage is used only as a fast cache so the page can paint immediately and
// still works if the network is momentarily unavailable.

import { DEFAULT_ITEMS, CATEGORIES } from "./menuData";
import {
  REST_URL,
  FUNCTIONS_URL,
  MENU_TABLE,
  SAVE_FUNCTION,
  supabaseHeaders,
} from "./supabaseConfig";

const KEY = "zukerino_menu_v1";
const EVT = "zukerino-menu-change";
const STATUS_EVT = "zukerino-menu-sync";

/* ------------------------------------------------------------------ helpers */

// Older menus stored cakes and cheesecakes as two separate categories; we now
// show them together. Normalising on read means the rename is purely front-end:
// rows can keep their original category value and still group correctly, so the
// menu never breaks regardless of when this code is deployed.
const CATEGORY_ALIASES = {
  Cakes: "Cakes & Cheesecakes",
  Cheesecakes: "Cakes & Cheesecakes",
};
function normCat(c) {
  return CATEGORY_ALIASES[c] || c || "Other";
}

// Map a database row (column `description`) to the app shape (`desc`).
function fromRow(r) {
  return {
    id: r.id,
    img: r.img,
    name: r.name ?? "",
    price: r.price ?? "",
    desc: r.description ?? "",
    featured: !!r.featured,
    category: normCat(r.category),
    diets: Array.isArray(r.diets) ? r.diets : [],
  };
}

function readCache() {
  if (typeof localStorage === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
}
function writeCache(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    /* ignore quota/availability errors */
  }
}

function emitStatus(state) {
  window.dispatchEvent(new CustomEvent(STATUS_EVT, { detail: state }));
}

/* ---------------------------------------------------------- admin PIN access */

const PIN_KEY = "zk_admin_pin";
export function setAdminPin(pin) {
  try {
    sessionStorage.setItem(PIN_KEY, pin);
  } catch {
    /* noop */
  }
}
function getAdminPin() {
  try {
    return sessionStorage.getItem(PIN_KEY) || "";
  } catch {
    return "";
  }
}

/* ----------------------------------------------------------------- read path */

// Synchronous, instant: the cached live menu (or the bundled seed for a brand-
// new visitor) so the page can paint before the network responds.
export function loadItems() {
  const cache = readCache();
  const items = Array.isArray(cache) && cache.length ? cache : DEFAULT_ITEMS;
  return items.map((i) => ({ ...i, category: normCat(i.category) }));
}

// Async: fetch the published menu from Supabase, refresh the cache, and notify
// subscribers. Falls back to the cache/defaults if the request fails.
export async function fetchItems() {
  try {
    const res = await fetch(
      `${REST_URL}/${MENU_TABLE}?select=*&order=sort.asc`,
      { headers: supabaseHeaders }
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    // Supabase is the source of truth — render exactly what's published, so
    // items can be added or removed by the owner and show up everywhere.
    const items = rows.map(fromRow);
    writeCache(items);
    window.dispatchEvent(new CustomEvent(EVT, { detail: items }));
    return items;
  } catch {
    return loadItems();
  }
}

/* ---------------------------------------------------------------- write path */

async function callFunction(payload) {
  const res = await fetch(`${FUNCTIONS_URL}/${SAVE_FUNCTION}`, {
    method: "POST",
    headers: { ...supabaseHeaders, "Content-Type": "application/json" },
    body: JSON.stringify({ pin: getAdminPin(), ...payload }),
  });
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      detail = (await res.json()).error || detail;
    } catch {
      /* noop */
    }
    throw new Error(detail);
  }
  return res.json();
}

// Debounce the network write so a burst of keystrokes becomes one request, while
// the UI updates immediately from the optimistic cache + event below.
let syncTimer = null;
let latest = null;

export function saveItems(items) {
  // 1) optimistic: update cache + notify the live menu right away
  writeCache(items);
  window.dispatchEvent(new CustomEvent(EVT, { detail: items }));

  // 2) debounce the publish to Supabase
  latest = items;
  emitStatus("saving");
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(async () => {
    syncTimer = null;
    const toSend = latest;
    latest = null;
    try {
      await callFunction({ action: "save", items: toSend });
      emitStatus("saved");
    } catch (e) {
      emitStatus("error");
      console.error("Menu save failed:", e);
    }
  }, 700);
}

export async function resetItems() {
  emitStatus("saving");
  try {
    await callFunction({ action: "reset" });
    const items = await fetchItems();
    emitStatus("saved");
    return items;
  } catch (e) {
    emitStatus("error");
    console.error("Menu reset failed:", e);
    return loadItems();
  }
}

/* ------------------------------------------------------------- add / delete */

// Add a brand-new product. `fields` = { name, price, desc, category, diets,
// featured }; `imageDataUrl` is a (compressed) data: URL the edge function
// uploads to Storage. The new item then behaves exactly like an imported one.
export async function addItem(fields, imageDataUrl) {
  emitStatus("saving");
  try {
    await callFunction({ action: "add", item: fields, image: imageDataUrl });
    const items = await fetchItems(); // refresh truth + notify the live menu
    emitStatus("saved");
    return items;
  } catch (e) {
    emitStatus("error");
    console.error("Add product failed:", e);
    throw e;
  }
}

// Permanently remove a product (and, if it was an uploaded photo, its image).
export async function deleteItem(id) {
  // optimistic: drop it from the cache + live menu right away
  const next = loadItems().filter((i) => i.id !== id);
  writeCache(next);
  window.dispatchEvent(new CustomEvent(EVT, { detail: next }));

  emitStatus("saving");
  try {
    await callFunction({ action: "delete", id });
    const items = await fetchItems();
    emitStatus("saved");
    return items;
  } catch (e) {
    emitStatus("error");
    console.error("Delete product failed:", e);
    return fetchItems(); // re-sync with server truth on failure
  }
}

/* --------------------------------------------------------------- subscription */

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

// Subscribe to publish status ("saving" | "saved" | "error") for the admin UI.
export function subscribeStatus(cb) {
  const on = (e) => cb(e.detail);
  window.addEventListener(STATUS_EVT, on);
  return () => window.removeEventListener(STATUS_EVT, on);
}

/* ----------------------------------------------------- optional backup export */

// Still available on the admin page as a one-click backup of the live menu.
export function exportDataFile(items) {
  const rows = items
    .map(
      (i) =>
        `  { id: ${JSON.stringify(i.id)}, img: ${JSON.stringify(i.img)}, ` +
        `name: ${JSON.stringify(i.name)}, price: ${JSON.stringify(i.price)}, ` +
        `desc: ${JSON.stringify(i.desc)}, featured: ${i.featured ? "true" : "false"}, ` +
        `category: ${JSON.stringify(i.category)}, diets: ${JSON.stringify(i.diets || [])} },`
    )
    .join("\n");
  return (
    `// Backup of the live Zukerino menu, exported on ${new Date().toLocaleString()}.\n\n` +
    `export const CATEGORIES = ${JSON.stringify(CATEGORIES)};\n\n` +
    `export const DEFAULT_ITEMS = [\n${rows}\n];\n`
  );
}
