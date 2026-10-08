import { Alert, Check, Clock, Plus } from "./icons.jsx";

const LINE = {
  ok: { Icon: Check, cls: "text-fresh" },
  warn: { Icon: Alert, cls: "text-expired" },
  buy: { Icon: Plus, cls: "text-accent" },
};

/** One of tonight's top picks: a Classical card with the reasons it made the cut. */
export default function DishCard({ rank, result, mins, label, has }) {
  const d = result.dish, m = +d.mins || 30, over = m > mins;
  const lines = [
    ...result.pros.map((t) => ["ok", t]),
    ...result.warns.map((t) => ["warn", t]),
    ...result.buy.map((t) => ["buy", "Need: " + t]),
  ];
  const uses = [...(d.need || []).filter(has), ...result.optHave.filter((k) => !(d.need || []).includes(k))].map(label);
  return (
    <article className={`card gap-3 p-4 ${rank === 1 ? "border-accent" : ""}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="card-kicker">Pick {rank}</span>
        <span className={`inline-flex items-center gap-1 rounded-[3px] border px-2 text-xs tnum ${over ? "border-expired text-expired italic" : "border-line"}`}>
          <Clock />{m} min
        </span>
        {d.wild && <span className="tag tag-accent">Dare</span>}
      </div>
      <h3 className="m-0 text-[25px]">{d.name}</h3>
      {d.blurb && <p className="card-body flex-none">{d.blurb}</p>}
      <ul className="m-0 flex list-none flex-col gap-[6px] p-0 text-[13.5px]">
        {lines.map(([kind, text], i) => {
          const { Icon, cls } = LINE[kind];
          return (
            <li key={i} className="grid grid-cols-[16px_1fr] gap-2">
              <Icon size={15} className={`mt-[3px] ${cls}`} />
              <span>{text}</span>
            </li>
          );
        })}
      </ul>
      <div className="card-meta mt-auto block border-t border-line pt-2 text-xs">
        From the fridge: {uses.join(", ") || "nothing yet"}{d.pantry ? `. Pantry: ${d.pantry}` : ""}.
      </div>
    </article>
  );
}
