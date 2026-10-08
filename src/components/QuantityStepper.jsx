import { Minus, Plus } from "./icons.jsx";

export default function QuantityStepper({ value, onChange, unit = ["egg", "eggs"] }) {
  return (
    <div className="inline-flex items-center self-start rounded-md border border-line">
      <button className="btn btn-ghost btn-icon text-ink" aria-label="One less" onClick={() => onChange(Math.max(0, value - 1))}><Minus /></button>
      <span className="min-w-[72px] border-x border-line text-center text-sm leading-[36px] tnum" aria-live="polite">
        {value} {value === 1 ? unit[0] : unit[1]}
      </span>
      <button className="btn btn-ghost btn-icon text-ink" aria-label="One more" onClick={() => onChange(value + 1)}><Plus /></button>
    </div>
  );
}
