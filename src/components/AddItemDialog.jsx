import { useEffect, useRef, useState } from "react";
import Seg from "./Seg.jsx";
import { CATS, ZONES } from "../data/items.js";

const iso = (d) => d.toISOString().slice(0, 10);

/** The design's "Pop something in the fridge" dialog. Render with `open` for a
 *  real modal, or `inline` to show it as a static specimen. */
export default function AddItemDialog({ open, inline, onClose, onSave }) {
  const ref = useRef(null);
  const [form, setForm] = useState(() => blank());
  function blank() {
    const d = new Date(); d.setDate(d.getDate() + 7);
    return inline ? { name: "Greek yoghurt", qty: "500 g", zone: "Fridge", cat: "Dairy", date: "2026-10-14" } : { name: "", qty: "", zone: "Fridge", cat: "Dairy", date: iso(d) };
  }

  useEffect(() => {
    const el = ref.current;
    if (inline || !el) return;
    if (open && !el.open) { setForm(blank()); el.showModal(); }
    if (!open && el.open) el.close();
  }, [open, inline]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target ? e.target.value : e }));
  const submit = (e) => {
    e.preventDefault();
    if (inline || !form.name.trim()) return;
    onSave({ ...form, name: form.name.trim(), qty: form.qty.trim() || "1", date: new Date(form.date + "T00:00") });
  };

  const body = (
    <form className="dialog" onSubmit={submit}>
      <div className="dialog-title">Pop something in the {form.zone.toLowerCase()}</div>
      <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-3">
        <div className="field"><label htmlFor={`n-${inline ? "s" : "d"}`}>What is it?</label>
          <input id={`n-${inline ? "s" : "d"}`} className="input" placeholder="e.g. Oat milk" value={form.name} onChange={set("name")} required autoFocus={!inline} /></div>
        <div className="field"><label htmlFor={`q-${inline ? "s" : "d"}`}>How much?</label>
          <input id={`q-${inline ? "s" : "d"}`} className="input" placeholder="1 L" value={form.qty} onChange={set("qty")} /></div>
      </div>
      <div className="field"><label>Where does it live?</label>
        <Seg name={`zone-${inline ? "s" : "d"}`} options={ZONES} value={form.zone} onChange={set("zone")} /></div>
      {!inline && (
        <div className="field"><label htmlFor="c-d">Category</label>
          <select id="c-d" className="input" value={form.cat} onChange={set("cat")}>
            {CATS.map((c) => <option key={c}>{c}</option>)}
          </select></div>
      )}
      <div className="field"><label htmlFor={`b-${inline ? "s" : "d"}`}>Best before</label>
        <input id={`b-${inline ? "s" : "d"}`} className="input" type="date" value={form.date} onChange={set("date")} required /></div>
      <div className="dialog-actions">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Not now</button>
        <button type="submit" className="btn btn-primary">Add to {form.zone.toLowerCase()}</button>
      </div>
    </form>
  );

  if (inline) return body;
  return (
    <dialog ref={ref} onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(440px,calc(100%-32px))] max-w-none overflow-visible border-0 bg-transparent p-0 text-ink backdrop:bg-[color-mix(in_srgb,var(--color-neutral-900)_50%,transparent)]">
      {body}
    </dialog>
  );
}
