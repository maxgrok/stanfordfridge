import { Check } from "./icons.jsx";

/** Toggle chip from the design system's category filters: accent outline + check when on. */
export default function Chip({ on, onClick, children, ...rest }) {
  return (
    <button type="button" aria-pressed={on} onClick={onClick} {...rest}
      className={`inline-flex cursor-pointer items-center gap-[6px] rounded-full border bg-transparent px-3 py-1 text-[13px] ${on
        ? "border-accent text-accent-700 hover:bg-accent/10"
        : "border-line text-inherit hover:border-accent"}`}>
      {on && <Check size={13} />}
      {children}
    </button>
  );
}
