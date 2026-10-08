import { useCallback, useEffect, useRef, useState } from "react";
import { SEED_DISHES, SEED_ITEMS } from "./seed.js";

// Same storage model as fridge.html: when the page runs inside Claude
// (window.claude), the menu and fridge list live in a shared database;
// otherwise they're kept in this browser, seeded from the fridge photos.
const LS = {
  get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};
const plain = (v) => JSON.parse(JSON.stringify(v));
const body = ({ id, ...rest }) => plain(rest);

export function useKitchen() {
  const [dishes, setDishes] = useState([]);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState("Loading the family menu…");
  const [mode, setMode] = useState("loading");
  const [sample, setSample] = useState(null);
  const db = useRef(null);
  const itemWrite = useRef(Promise.resolve());

  useEffect(() => {
    let off = [];
    (async () => {
      const c = window.claude && window.claude.use ? window.claude : null;
      db.current = c ? await c.use("db") : null;
      if (db.current) {
        setMode("db");
        const got = { d: false, i: false };
        const ready = () => { if (got.d && got.i) { setLoaded(true); setStatus(""); } };
        off.push(db.current.collection("dishes").onSnapshot(
          (s) => { setDishes(s.docs.map((d) => ({ id: d.id, ...d.data() }))); got.d = true; ready(); },
          () => setStatus("Couldn't load the menu. Reload the page to try again."),
        ));
        off.push(db.current.doc("kitchen/fridge").onSnapshot(
          (s) => { setItems(s.exists ? s.data().items || [] : []); got.i = true; ready(); },
          () => setStatus("Couldn't load the fridge list. Reload the page to try again."),
        ));
      } else {
        setMode("local");
        setDishes(LS.get("dishes") ?? SEED_DISHES);
        setItems(LS.get("items") ?? SEED_ITEMS);
        setLoaded(true);
        setStatus("Saved on this device only. Open this page in Claude to share the menu with the family.");
      }
      if (c) setSample(await c.use("sample"));
    })();
    return () => off.forEach((u) => typeof u === "function" && u());
  }, []);

  const saveDish = useCallback(async (d) => {
    if (mode === "db") {
      if (d.id) await db.current.collection("dishes").doc(d.id).set(body(d));
      else await db.current.collection("dishes").add(body(d));
      return;
    }
    setDishes((list) => {
      const next = d.id ? list.map((x) => (x.id === d.id ? d : x)) : [...list, { ...d, id: "l" + Date.now() }];
      LS.set("dishes", next);
      return next;
    });
  }, [mode]);

  const removeDish = useCallback(async (id) => {
    if (mode === "db") return db.current.collection("dishes").doc(id).delete();
    setDishes((list) => { const next = list.filter((x) => x.id !== id); LS.set("dishes", next); return next; });
  }, [mode]);

  /** Optimistic: updates the screen right away, then persists. */
  const saveItems = useCallback((next, onError) => {
    setItems(next);
    if (mode === "db") {
      itemWrite.current = itemWrite.current
        .then(() => db.current.doc("kitchen/fridge").set({ items: plain(next) }))
        .catch(onError);
    } else LS.set("items", next);
  }, [mode]);

  const resetKitchen = useCallback(() => {
    setDishes(SEED_DISHES); setItems(SEED_ITEMS);
    LS.set("dishes", SEED_DISHES); LS.set("items", SEED_ITEMS);
  }, []);

  return { mode, loaded, status, dishes, items, sample, setSample, saveDish, removeDish, saveItems, resetKitchen };
}
