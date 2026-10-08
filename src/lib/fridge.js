// Dinner-picker logic ported from fridge.html. Pure functions: pass in the
// current context ({ day, diners, mins, mayaEggs, items }) and get results back.

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const PEOPLE = [["mom", "Mom"], ["r", "R / Rick"], ["sam", "Sam"], ["leo", "Leo"], ["maya", "Maya"], ["jo", "Grandma Jo"], ["theo", "Theo"]];
export const CATEGORIES = [
  ["produce", "Produce"], ["fruit", "Fruit"], ["dairy", "Dairy"], ["meat", "Meat"],
  ["protein", "Plant protein"], ["frozen", "Frozen"], ["carb", "Bread & carbs"], ["condiment", "Condiment"],
];
export const TODAY = (new Date().getDay() + 6) % 7;

export function defaultDiners(day) {
  const d = new Set(["mom", "r", "sam", "leo", "maya"]);
  if (day >= 5) d.add("jo");
  if (day === 4) d.add("theo");
  return d;
}

export const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 30) || "item";
export const hasOnlyDay = (d) => d.onlyDay != null && d.onlyDay !== "";

export function writeErr(e) {
  return e && e.code === "permission_denied"
    ? "You can view this menu but not change it."
    : "Couldn't save that change. Check your connection and try again.";
}

export function fridgeHelpers(items) {
  const map = Object.fromEntries(items.map((i) => [i.key, i]));
  return {
    map,
    label: (k) => (map[k] ? map[k].label.replace(/ \(.*\)/, "") : k),
    has: (k) => !!(map[k] && map[k].have),
  };
}

/** Freshness of a fridge item relative to the chosen night, for ExpiryBadge. */
export function freshness(item, day) {
  if (item.useBy == null) return null;
  const n = item.useBy - day;
  const status = n < 0 ? "expired" : n <= 3 ? "soon" : "fresh";
  const label = n < 0 ? `Was due ${DAYS_LONG[item.useBy]}` : n === 0 ? "Use today" : n === 1 ? "Use by tomorrow" : `Use by ${DAYS_LONG[item.useBy]}`;
  return { status, label };
}

export function score(dish, ctx) {
  const { day, diners: who, mins, mayaEggs } = ctx;
  const { map: im, label, has } = ctx.fridge;
  const pros = [], warns = [], buy = [];
  let s = 50;
  const need = dish.need || [], opt = dish.opt || [];
  if (who.has("jo") && !dish.veg) return null;
  if (who.has("theo") && dish.peanuts) return null;
  if (hasOnlyDay(dish) && +dish.onlyDay !== day) return null;
  const m = +dish.mins || 30;
  if (m <= mins) { s += Math.round((mins - m) / mins * 18); if (m <= mins * 0.6) pros.push(`Done in about ${m} minutes, well inside your ${mins}.`); }
  else { s -= 25 + (m - mins); warns.push(`Takes about ${m} minutes, ${m - mins} more than you have.`); }
  for (const k of need) { if (!has(k)) { s -= 28; buy.push(label(k) + (im[k] && im[k].short ? " (already on the grocery list)" : "")); } }
  const optHave = opt.filter(has); s += optHave.length * 2;
  for (const k of [...need, ...opt]) {
    const it = im[k]; if (!it || !it.have) continue;
    if (it.useBy != null) {
      if (day < it.useBy) { s += 22; pros.push(`Uses up the ${label(k).toLowerCase()} before it turns on ${DAYS_LONG[it.useBy]}.`); }
      else if (day === it.useBy) { s += 6; warns.push(`Check the ${label(k).toLowerCase()} first; the note said use it before ${DAYS_LONG[it.useBy]}.`); }
    } else if (it.note) { warns.push(`${label(k)}: ${it.note}`); }
  }
  if (who.has("sam")) {
    const g = dish.green || "none";
    if (g === "sam") { s += 12; pros.push("Broccoli as 'trees' with cheese on top, the one green thing Sam eats."); }
    else if (g === "none") { s += 10; pros.push("Nothing green on the plate for Sam."); }
    else if (g === "hide") { s += 10; pros.push("The greens are blended in, so Sam won't see anything green."); }
    else if (g === "split") { s += 2; warns.push("Plate Sam's portion before the greens go in."); }
    else { s -= 18; warns.push("Hard to keep green off Sam's plate (peas count as green)."); }
  }
  if (who.has("maya")) {
    if (dish.eggs && !mayaEggs) { s -= 10; warns.push("Maya hasn't decided whether eggs are OK."); }
    if (dish.plant === "yes") { s += 12; pros.push("Fully plant-based for Maya as written."); }
    else if (dish.plant === "swap") { s += 6; pros.push("Easy plant-based swap for Maya" + (dish.swap ? ": " + dish.swap : "") + "."); }
    else if (dish.veg) { s -= 8; warns.push("Not plant-based; Maya would need something else."); }
    else { s -= 14; warns.push("Has meat, which doesn't work for Maya this month."); }
  }
  if (who.has("jo")) {
    pros.push("Vegetarian with no fish or chicken broth, so it works for Grandma Jo.");
    if (dish.salt === "low") { s += 10; pros.push("Easy to keep low-salt for Grandma; salt at the table instead."); }
    else if (dish.salt === "med") { warns.push("Go light on salt and use low-sodium soy or broth for Grandma."); }
    else { s -= 16; warns.push("This one runs salty, which goes against Grandma's doctor's orders."); }
  }
  if (who.has("theo")) pros.push("No peanuts for Theo; still read every label, including sauces and oils.");
  if (hasOnlyDay(dish)) { s += 14; pros.push(dish.onlyNote || `Saved for ${DAYS_LONG[+dish.onlyDay]}.`); }
  return { dish, s, pros, warns, buy, optHave };
}

export function rank(dishes, ctx) {
  return dishes.map((d) => score(d, ctx)).filter(Boolean).sort((a, b) => b.s - a.s);
}

/* ---------- mystery box ---------- */
const TECH = [["Stuffed", "stuffed inside"], ["Crispy", "pan-fried until crispy with"], ["Glazed", "glazed with"], ["Smashed", "smashed together with"], ["Layered", "layered like lasagna with"], ["Skewered", "threaded on skewers with"], ["Tostada-style", "piled high on top with"], ["Upside-down", "baked upside-down with"]];
const BASES = [{ name: "waffle", item: "waffles" }, { name: "pizza", item: "pizza" }, { name: "quesadilla", item: "tortillas" }, { name: "baked potato", pantry: "potatoes" }, { name: "rice bowl", pantry: "rice" }, { name: "pasta", pantry: "pasta" }, { name: "grilled cheese", item: "bread" }];
const DARES = ["The cook doesn't reveal the ingredients until everyone has taken a bite.", "Everyone rates it out of 10. Lowest score does the dishes.", "Eat it with chopsticks. No exceptions.", "Whoever makes a face first picks tomorrow's dinner, and it has to be the boring one.", "Name it something fancy and serve it like a restaurant."];
const pick = (a) => a[Math.floor(Math.random() * a.length)];
function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

export function mystery(ctx) {
  const { day, diners, items } = ctx;
  const { label } = ctx.fridge;
  const noMeat = diners.has("jo") || diners.has("maya");
  const usable = items.filter((i) => i.have && !(noMeat && i.cat === "meat") && !(i.reserveDay != null && i.reserveDay !== day) && !(diners.has("theo") && i.peanuts));
  const bases = BASES.filter((b) => !b.item || usable.some((i) => i.key === b.item));
  const base = pick(bases.length ? bases : [{ name: "rice bowl", pantry: "rice" }]);
  const pool = usable.filter((i) => i.key !== base.item && ["produce", "fruit", "dairy", "condiment", "frozen", "meat", "protein"].includes(i.cat));
  if (pool.length < 2) return null;
  const byCat = {}; shuffle(pool).forEach((i) => { (byCat[i.cat] = byCat[i.cat] || []).push(i); });
  const cats = shuffle(Object.keys(byCat));
  // force one sweet-ish and one savory-ish if available
  const chosen = [];
  const sweet = pool.filter((i) => i.cat === "fruit"), tangy = pool.filter((i) => i.cat === "condiment");
  if (sweet.length) chosen.push(pick(sweet));
  if (tangy.length) chosen.push(pick(tangy));
  for (const c of cats) { if (chosen.length >= 3) break; const it = byCat[c].find((i) => !chosen.includes(i)); if (it && !chosen.some((x) => x.cat === c)) chosen.push(it); }
  const picked = chosen.slice(0, 3);
  const [tName, tVerb] = pick(TECH);
  const lbl = (i) => label(i.key).toLowerCase();
  const title = `${tName} ${picked.slice(0, 2).map((i) => label(i.key)).join("-")} ${base.name}`;
  const weird = picked.filter((i) => i.cat === "fruit").length + picked.filter((i) => i.cat === "condiment").length + (base.name === "waffle" ? 1 : 0);
  const heat = Math.min(3, 1 + Math.floor(weird / 1.5));
  const notes = [];
  if (picked.some((i) => i.green) && diners.has("sam")) notes.push("Bonus dare for Sam: one green bite earns a free pass on tomorrow's veg.");
  if (picked.some((i) => i.cat === "dairy") && diners.has("maya")) notes.push("Maya's portion skips the dairy.");
  if (picked.some((i) => i.useBy != null && day < i.useBy)) notes.push("Bonus: it uses up something that's about to turn.");
  if (diners.has("theo")) notes.push("Peanut-free, but check every label for Theo.");
  return {
    title, base, items: picked,
    line: `A ${base.name} ${tVerb} ${picked.map(lbl).join(", ").replace(/, ([^,]*)$/, " and $1")}.`,
    dare: pick(DARES), heat, notes, mins: base.name === "baked potato" ? 60 : 25,
  };
}

export function boxToDish(b) {
  const keys = b.items.map((i) => i.key); if (b.base.item) keys.push(b.base.item);
  return {
    name: b.title, blurb: (b.blurb || b.line) + (b.steps ? " Steps: " + b.steps.join(" ") : ""), mins: b.mins, pantry: b.base.pantry || "", need: keys, opt: [],
    veg: !b.items.some((i) => i.cat === "meat"), peanuts: false, eggs: b.items.some((i) => i.key === "eggs"),
    plant: b.items.some((i) => i.cat === "dairy" || i.key === "eggs" || i.cat === "meat") ? "swap" : "yes", swap: "leave the dairy off Maya's",
    green: b.items.some((i) => i.green) ? "split" : "none", salt: "med", onlyDay: null, wild: true,
  };
}

export function houseRules(diners) {
  const rules = [];
  if (diners.has("jo")) rules.push("vegetarian, no fish, no chicken broth, low salt");
  if (diners.has("maya")) rules.push("plant-based option for one person");
  if (diners.has("theo")) rules.push("strictly peanut-free (serious allergy)");
  if (diners.has("sam")) rules.push("one kid refuses anything visibly green");
  return rules;
}
