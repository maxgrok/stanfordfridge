import { Check } from "./icons.jsx";

export default function Toast({ message, onUndo, className = "" }) {
  return (
    <div role="status" className={`elev-md flex items-center gap-3 rounded-md border border-line bg-surface py-2 pr-2 pl-3 text-sm ${className}`}>
      <Check size={16} w={1.8} className="flex-none text-fresh" />
      <span className="flex-1">{message}</span>
      {onUndo !== null && <button className="btn btn-ghost" onClick={onUndo}>Undo</button>}
    </div>
  );
}
