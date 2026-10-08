import { useState } from "react";
import ExpiryBadge from "./ExpiryBadge.jsx";
import { X } from "./icons.jsx";
import { CATEGORIES, freshness, slug } from "../lib/fridge.js";

export default function FridgePanel({ items, day, onChange }) {
  const [name, setName] = useState("");
  const [cat, setCat] = useState("produce");
  const have = items.filter((i) => i.have).length;

  const add = (e) => {
    e.preventDefault();
    const n = name.trim(); if (!n) return;
    const keys = new Set(items.map((i) => i.key));
    let key = slug(n), k = 2;
    while (keys.has(key)) key = slug(n) + "-" + k++;
    onChange([...items, { key, label: n, have: true, cat }]);
    setName("");
  };

  return (
    <section className="card gap-3 p-4" aria-labelledby="inv-h">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="inv-h" className="m-0 text-[25px]">What's in the fridge</h2>
        <span className="text-xs opacity-60 tnum">{have} of {items.length} in</span>
      </div>
      <details className="group" open>
        <summary className="btn btn-ghost -ml-1 cursor-pointer list-none">
          <span className="group-open:hidden">Check off what you have, or add and remove items</span>
          <span className="hidden group-open:inline">Hide the fridge list</span>
        </summary>
        <ul className="mt-2 grid list-none grid-cols-1 gap-x-4 p-0 sm:grid-cols-2">
          {items.map((i) => {
            const f = freshness(i, day);
            const missing = i.short && !i.have;
            return (
              <li key={i.key} className="flex items-center gap-2 border-b border-line py-[6px] text-sm">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
                  <input type="checkbox" checked={!!i.have} className="m-0 size-4 flex-none accent-accent"
                    onChange={(e) => onChange(items.map((x) => (x.key === i.key ? { ...x, have: e.target.checked } : x)))} />
                  <span className={`truncate ${missing ? "text-expired italic" : ""}`}>{i.label}</span>
                </label>
                {missing && <span className="tag tag-accent">On the list</span>}
                {f && i.have && <ExpiryBadge {...f} />}
                <button type="button" className="btn btn-ghost btn-icon size-7 flex-none text-ink opacity-50 hover:opacity-100"
                  aria-label={`Remove ${i.label}`} onClick={() => onChange(items.filter((x) => x.key !== i.key))}><X /></button>
              </li>
            );
          })}
          {!items.length && <li className="text-sm opacity-70">No fridge items yet. Add the first one below.</li>}
        </ul>
        <form className="mt-3 flex flex-wrap gap-2" onSubmit={add}>
          <input className="input min-w-[9rem] flex-1" placeholder="New item, e.g. Tofu" aria-label="New fridge item" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} />
          <select className="input w-auto" aria-label="Category" value={cat} onChange={(e) => setCat(e.target.value)}>
            {CATEGORIES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Add item</button>
        </form>
      </details>
      <p className="m-0 text-xs opacity-65">Items in italic red are on the grocery list and not in yet. Eggs start unchecked because the list says they're out; tick them if you have some.</p>
    </section>
  );
}
