import { useEffect, useRef, useState } from "react";
import { DAYS_LONG, writeErr } from "../lib/fridge.js";

const blank = { name: "", blurb: "", mins: 30, pantry: "", veg: true, peanuts: false, eggs: false, plant: "no", swap: "", green: "none", salt: "med", onlyDay: "" };

function fromDish(d) {
  if (!d) return { ...blank, links: {} };
  const links = {};
  (d.need || []).forEach((k) => (links[k] = "need"));
  (d.opt || []).forEach((k) => (links[k] = "opt"));
  return {
    name: d.name || "", blurb: d.blurb || "", mins: d.mins || 30, pantry: d.pantry || "",
    veg: !!d.veg, peanuts: !!d.peanuts, eggs: !!d.eggs, plant: d.plant || "no", swap: d.swap || "",
    green: d.green || "none", salt: d.salt || "med", onlyDay: d.onlyDay != null ? String(d.onlyDay) : "", links,
  };
}

const Field = ({ id, label: l, children, hint }) => (
  <div className="field"><label htmlFor={id}>{l}</label>{children}{hint && <span className="mt-1 block text-[11px] opacity-60">{hint}</span>}</div>
);

/** Add / edit a dinner, as a Classical dialog. `dish` undefined = closed, null = new. */
export default function DishDialog({ dish, items, label, onSave, onClose }) {
  const ref = useRef(null);
  const [f, setF] = useState(() => fromDish(null));
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const open = dish !== undefined;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (open && !el.open) { setF(fromDish(dish)); setErr(""); el.showModal(); }
    if (!open && el.open) el.close();
  }, [open, dish]);

  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const link = (k, v) => setF((s) => ({ ...s, links: { ...s.links, [k]: v } }));

  async function submit(e) {
    e.preventDefault();
    const name = f.name.trim(); if (!name) { setErr("Give the dinner a name."); return; }
    // links to items since removed from the fridge list are kept as they were
    const need = Object.keys(f.links).filter((k) => f.links[k] === "need");
    const opt = Object.keys(f.links).filter((k) => f.links[k] === "opt");
    const d = {
      ...(dish || {}), name, blurb: f.blurb.trim(), mins: Math.max(5, +f.mins || 30), pantry: f.pantry.trim(), need, opt,
      veg: f.veg, peanuts: f.peanuts, eggs: f.eggs, plant: f.plant, swap: f.swap.trim(), green: f.green, salt: f.salt,
      onlyDay: f.onlyDay === "" ? null : +f.onlyDay,
    };
    if (f.onlyDay === "") delete d.onlyNote;
    setSaving(true);
    try { await onSave(d, !!dish); }
    catch (e2) { setErr(writeErr(e2)); }
    finally { setSaving(false); }
  }

  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()} aria-labelledby="dlg-h"
      className="m-auto max-h-[90vh] w-[min(600px,calc(100%-32px))] max-w-none border-0 bg-transparent p-0 text-ink backdrop:bg-[color-mix(in_srgb,var(--color-neutral-900)_50%,transparent)]">
      <form className="dialog w-full max-h-[90vh] overflow-auto" onSubmit={submit}>
        <div id="dlg-h" className="dialog-title">{dish ? "Edit dinner" : "Add a dinner"}</div>
        <Field id="fName" label="Name"><input id="fName" className="input" required maxLength={60} value={f.name} onChange={set("name")} autoFocus /></Field>
        <Field id="fBlurb" label="What it is"><textarea id="fBlurb" className="input min-h-[70px] resize-y" maxLength={240} value={f.blurb} onChange={set("blurb")} /></Field>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field id="fMins" label="Prep time (minutes)"><input id="fMins" className="input" type="number" min="5" max="240" step="5" required value={f.mins} onChange={set("mins")} /></Field>
          <Field id="fPantry" label="Pantry staples"><input id="fPantry" className="input" placeholder="pasta, rice…" maxLength={100} value={f.pantry} onChange={set("pantry")} /></Field>
        </div>
        <fieldset className="m-0 rounded-md border border-line p-3">
          <legend className="px-1 text-xs opacity-70">From the fridge</legend>
          {items.length ? (
            <div className="grid max-h-56 grid-cols-1 gap-x-4 gap-y-1 overflow-auto sm:grid-cols-2">
              {items.map((i) => (
                <label key={i.key} className="flex items-center justify-between gap-2 text-[13px]">
                  <span className="truncate">{label(i.key)}</span>
                  <select className="input min-h-0 w-auto py-[2px] text-xs" value={f.links[i.key] || ""} onChange={(e) => link(i.key, e.target.value)}>
                    <option value="">—</option><option value="need">Must have</option><option value="opt">Nice to have</option>
                  </select>
                </label>
              ))}
            </div>
          ) : <p className="m-0 text-sm opacity-70">Add fridge items first to link ingredients.</p>}
        </fieldset>
        <fieldset className="m-0 flex flex-col gap-1 rounded-md border border-line p-3 text-sm">
          <legend className="px-1 text-xs opacity-70">House rules</legend>
          <label className="flex items-center gap-2"><input type="checkbox" className="m-0 size-4 accent-accent" checked={f.veg} onChange={set("veg")} />Vegetarian: no meat, fish or chicken broth (needed for Grandma Jo)</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="m-0 size-4 accent-accent" checked={f.peanuts} onChange={set("peanuts")} />Contains peanuts or peanut oil (never on Theo's nights)</label>
          <label className="flex items-center gap-2"><input type="checkbox" className="m-0 size-4 accent-accent" checked={f.eggs} onChange={set("eggs")} />Uses eggs</label>
        </fieldset>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field id="fPlant" label="Plant-based for Maya?">
            <select id="fPlant" className="input" value={f.plant} onChange={set("plant")}>
              <option value="yes">Yes, as written</option><option value="swap">With a swap</option><option value="no">No</option>
            </select>
          </Field>
          <Field id="fSwap" label="The swap"><input id="fSwap" className="input" placeholder="leave the cheese off Maya's" maxLength={100} value={f.swap} onChange={set("swap")} /></Field>
          <Field id="fGreen" label="Green on Sam's plate?">
            <select id="fGreen" className="input" value={f.green} onChange={set("green")}>
              <option value="none">Nothing green</option><option value="sam">Broccoli trees with cheese</option>
              <option value="hide">Greens hidden (blended)</option><option value="split">Plate Sam's first</option><option value="visible">Visibly green</option>
            </select>
          </Field>
          <Field id="fSalt" label="Salt level">
            <select id="fSalt" className="input" value={f.salt} onChange={set("salt")}>
              <option value="low">Low</option><option value="med">Medium</option><option value="high">High</option>
            </select>
          </Field>
        </div>
        <Field id="fDay" label="Only on one night?" hint="Like Leo's chicken tenders, saved for Saturday.">
          <select id="fDay" className="input" value={f.onlyDay} onChange={set("onlyDay")}>
            <option value="">Any night</option>
            {DAYS_LONG.map((n, i) => <option key={n} value={String(i)}>{n}</option>)}
          </select>
        </Field>
        <div className="dialog-actions sticky bottom-0 -mx-4 -mb-4 items-center border-t border-line bg-surface px-4 py-3">
          <p role="alert" className="m-0 mr-auto text-sm text-expired">{err}</p>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={saving}>{dish ? "Save changes" : "Save dinner"}</button>
        </div>
      </form>
    </dialog>
  );
}
