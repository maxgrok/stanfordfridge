import Chip from "./Chip.jsx";
import Seg from "./Seg.jsx";
import { DAYS, PEOPLE } from "../lib/fridge.js";

export default function WhoPanel({ day, onDay, diners, onToggle, mins, onMins, mayaEggs, onMayaEggs }) {
  return (
    <section className="card gap-4 p-4" aria-labelledby="who-h">
      <h2 id="who-h" className="m-0 text-[25px]">Which night, and who's eating?</h2>
      <div className="overflow-x-auto">
        <Seg name="night" value={day} onChange={onDay} options={DAYS.map((d, i) => ({ value: i, label: d }))} />
      </div>
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Who's eating">
          {PEOPLE.map(([k, n]) => <Chip key={k} on={diners.has(k)} onClick={() => onToggle(k)}>{n}</Chip>)}
        </div>
        <p className="mt-2 mb-0 text-xs opacity-65">Grandma Jo is added for Sat–Sun and Theo for Friday, per the notes. Tap a name to change it.</p>
      </div>
      <div className="field">
        <label htmlFor="mins" className="flex justify-between">Time to cook <b className="font-semibold text-ink tnum">{mins} min</b></label>
        <input id="mins" type="range" min="10" max="90" step="5" value={mins} onChange={(e) => onMins(+e.target.value)}
          aria-describedby="minsHelp" className="w-full accent-accent" />
        <div className="flex justify-between text-[11px] opacity-60 tnum" aria-hidden="true"><span>10 min</span><span>90 min</span></div>
        <p id="minsHelp" className="mt-1 mb-0 text-xs opacity-65">Quicker dinners move up; anything longer drops down the list.</p>
      </div>
      <label className="inline-flex cursor-pointer items-start gap-2 text-sm">
        <input type="checkbox" checked={mayaEggs} onChange={(e) => onMayaEggs(e.target.checked)} className="m-0 mt-[3px] size-4 flex-none accent-accent" />
        Maya is OK with eggs this month (her note says still deciding)
      </label>
    </section>
  );
}
