import { DAYS_LONG, hasOnlyDay } from "../lib/fridge.js";

export default function MenuTable({ dishes, onEdit, onDelete }) {
  const list = [...dishes].sort((a, b) => a.name.localeCompare(b.name));
  if (!list.length) return <p className="text-sm opacity-70">No dinners yet. Add the first one.</p>;
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead><tr><th>Dinner</th><th>Time</th><th>House rules</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {list.map((d) => {
            const tags = [
              d.veg ? "Vegetarian" : "Has meat",
              d.plant === "yes" ? "Plant-based" : d.plant === "swap" ? "Plant-based swap" : null,
              d.peanuts ? "Peanuts" : null,
              hasOnlyDay(d) ? "Only " + DAYS_LONG[+d.onlyDay] : null,
            ].filter(Boolean);
            return (
              <tr key={d.id}>
                <td className="font-heading text-[17px] font-semibold">
                  {d.name}{d.wild && <span className="tag tag-accent ml-2 align-middle font-body">Dare</span>}
                </td>
                <td className="whitespace-nowrap tnum">{+d.mins || 30} min</td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {tags.map((t) => <span key={t} className={`tag ${t === "Peanuts" ? "tag-outline" : "tag-neutral"}`}>{t}</span>)}
                  </div>
                </td>
                <td className="text-right whitespace-nowrap">
                  <button className="btn btn-ghost text-[13px]" onClick={() => onEdit(d)}>Edit</button>
                  <button className="btn btn-ghost text-[13px] text-expired hover:bg-expired/10" onClick={() => onDelete(d)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
