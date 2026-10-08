import { useState } from "react";
import ExpiryBadge from "./ExpiryBadge.jsx";
import Seg from "./Seg.jsx";
import Chip from "./Chip.jsx";
import { FreezerIcon, FridgeIcon, PantryIcon } from "./icons.jsx";
import { CATS, EMPTY, ZONES } from "../data/items.js";

const ZONE_ICON = { Fridge: FridgeIcon, Freezer: FreezerIcon, Pantry: PantryIcon };

export default function Inventory({ items, onUse, onAdd }) {
  const [zone, setZone] = useState("Fridge");
  const [cats, setCats] = useState([]);
  const [view, setView] = useState("Cards");

  const shown = items.filter((i) => i.zone === zone && (!cats.length || cats.includes(i.cat)));
  const toggle = (c) => setCats((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const used = (it) => <button className="btn btn-ghost text-[13px]" onClick={() => onUse(it)}>Used it up</button>;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line">
        <div role="tablist" className="flex gap-6">
          {ZONES.map((z) => {
            const Ico = ZONE_ICON[z];
            return (
              <button key={z} role="tab" aria-selected={z === zone} onClick={() => setZone(z)}
                className="relative flex cursor-pointer items-center gap-2 border-0 bg-transparent pt-2 pb-3 font-heading text-xl font-semibold text-inherit hover:text-accent">
                <Ico />
                {z}
                <span className="font-body text-xs font-normal opacity-60 tnum">{items.filter((i) => i.zone === z).length}</span>
                {z === zone && <span className="absolute inset-x-0 -bottom-px h-[2px] bg-accent" />}
              </button>
            );
          })}
        </div>
        <Seg name="inv-view" className="mb-2" options={["Cards", "List"]} value={view} onChange={setView} />
      </div>

      <div className="flex flex-wrap gap-2">
        {CATS.map((c) => {
          return <Chip key={c} on={cats.includes(c)} onClick={() => toggle(c)}>{c}</Chip>;
        })}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-line p-8 text-center">
          <div className="font-heading text-2xl font-semibold">{EMPTY[zone][0]}</div>
          <p className="m-0 max-w-[40ch] text-sm opacity-75">{EMPTY[zone][1]}</p>
          <button className="btn btn-primary mt-2" onClick={onAdd}>Add something</button>
        </div>
      ) : view === "Cards" ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
          {shown.map((it) => (
            <div key={it.id} className="card gap-3">
              <div>
                <div className="card-title">{it.name}</div>
                <div className="card-meta mt-[3px]">{it.cat} · {it.zone}</div>
              </div>
              <div><ExpiryBadge status={it.status} label={it.label} /></div>
              <div className="flex items-center justify-between border-t border-line pt-2">
                <span className="text-[13px] tnum">{it.qty}</span>
                {used(it)}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>Item</th><th>Amount</th><th>Category</th><th>Where</th><th>Use by</th><th><span className="sr-only">Actions</span></th></tr></thead>
            <tbody>
              {shown.map((it) => (
                <tr key={it.id}>
                  <td className="font-heading text-[17px] font-semibold">{it.name}</td>
                  <td className="tnum">{it.qty}</td>
                  <td><span className="tag tag-neutral">{it.cat}</span></td>
                  <td>{it.zone}</td>
                  <td><ExpiryBadge status={it.status} label={it.label} /></td>
                  <td className="text-right">{used(it)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
