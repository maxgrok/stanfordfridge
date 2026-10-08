// Sample household inventory. Dates are offsets from today so the demo
// always shows a mix of fresh, eat-soon and expired items.
const SAMPLE = [
  { name: "Whole milk", qty: "1 L", cat: "Dairy", zone: "Fridge", in: 2 },
  { name: "Greek yoghurt", qty: "500 g", cat: "Dairy", zone: "Fridge", in: -1 },
  { name: "Baby spinach", qty: "½ bag", cat: "Veg", zone: "Fridge", in: 1 },
  { name: "Mature cheddar", qty: "200 g", cat: "Dairy", zone: "Fridge", in: 21 },
  { name: "Leftover dal", qty: "1 tub", cat: "Leftovers", zone: "Fridge", in: 3 },
  { name: "Free-range eggs", qty: "6", cat: "Dairy", zone: "Fridge", in: 12 },
  { name: "Chicken thighs", qty: "600 g", cat: "Meat", zone: "Freezer", in: 100 },
  { name: "Garden peas", qty: "1 kg", cat: "Veg", zone: "Freezer", in: 146 },
  { name: "Basmati rice", qty: "2 kg", cat: "Grains", zone: "Pantry", in: 298 },
  { name: "Chopped tomatoes", qty: "3 tins", cat: "Tins", zone: "Pantry", in: 482 },
];

export const CATS = ["Dairy", "Veg", "Meat", "Leftovers", "Grains", "Tins"];
export const ZONES = ["Fridge", "Freezer", "Pantry"];
export const EMPTY = {
  Fridge: ["Nothing matches here", "Try another category, or pop something new in."],
  Freezer: ["The freezer's having a quiet week", "Frozen peas count. So does that loaf you meant to save."],
  Pantry: ["The pantry shelf is bare", "Rice, tins, the good olive oil — add the staples you rely on."],
};

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function sampleItems(today = startOfToday()) {
  return SAMPLE.map(({ in: offset, ...it }, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return { id: i + 1, ...it, date: d };
  });
}

/** Freshness status and warm, human label for an item. */
export function expiry(it, today = startOfToday(), fmt = "Relative") {
  const d = it.date;
  const days = Math.round((d - today) / 864e5);
  const status = days < 0 ? "expired" : days <= 3 ? "soon" : "fresh";
  let label;
  if (fmt === "Date") {
    label = (days < 0 ? "Was due " : "Use by ") + d.getDate() + " " + MON[d.getMonth()] +
      (d.getFullYear() !== today.getFullYear() ? " " + d.getFullYear() : "");
  } else if (days < -1) label = "Expired " + -days + " days ago";
  else if (days === -1) label = "Expired yesterday";
  else if (days === 0) label = "Use today";
  else if (days === 1) label = "Use by tomorrow";
  else if (days <= 45) label = days + " days left";
  else label = Math.round(days / 30) + " months left";
  return { ...it, days, status, label };
}
