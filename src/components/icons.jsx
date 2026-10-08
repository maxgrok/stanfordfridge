const stroke = (w = 1.6) => ({ fill: "none", stroke: "currentColor", strokeWidth: w, strokeLinecap: "round", strokeLinejoin: "round" });

const Icon = ({ size = 15, w, children, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={stroke(w)} aria-hidden="true" {...rest}>{children}</svg>
);

export const Plus = (p) => <Icon {...p}><path d="M5 12h14M12 5v14" /></Icon>;
export const Minus = (p) => <Icon {...p}><path d="M5 12h14" /></Icon>;
export const Check = (p) => <Icon w={2} {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
export const Trash = (p) => <Icon size={16} w={1.5} {...p}><path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></Icon>;
export const Search = (p) => <Icon {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>;
export const Sun = (p) => <Icon size={14} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></Icon>;
export const Moon = (p) => <Icon size={14} {...p}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Icon>;
export const FridgeIcon = (p) => <Icon size={18} w={1.5} {...p}><path d="M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6ZM5 10h14M15 6v1M15 13v3" /></Icon>;
export const FreezerIcon = (p) => <Icon size={18} w={1.5} {...p}><path d="M2 12h20M12 2v20M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" /></Icon>;
export const PantryIcon = (p) => <Icon size={18} w={1.5} {...p}><rect x="2" y="3" width="20" height="5" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8M10 12h4" /></Icon>;
