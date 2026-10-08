// Outline and a dot, never a fill. Expired swaps the dot for a ring and sets in
// italic, so status never relies on colour alone.
const TONE = {
  fresh: "border-fresh text-fresh",
  soon: "border-soon text-soon",
  expired: "border-expired text-expired italic",
  none: "border-dashed border-line text-ink/60",
};
const DOT = {
  fresh: "bg-fresh",
  soon: "bg-soon",
  expired: "border-[1.5px] border-expired",
};

export default function ExpiryBadge({ status = "fresh", label = "9 days left" }) {
  return (
    <span className={`inline-flex items-center gap-[6px] whitespace-nowrap rounded-[3px] border px-[9px] py-[2px] font-body text-xs leading-normal tnum ${TONE[status]}`}>
      {DOT[status] && <span className={`size-[6px] rounded-full ${DOT[status]}`} />}
      {label}
    </span>
  );
}
