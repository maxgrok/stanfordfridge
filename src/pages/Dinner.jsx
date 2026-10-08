import { useMemo, useRef, useState } from "react";
import WhoPanel from "../components/WhoPanel.jsx";
import FridgePanel from "../components/FridgePanel.jsx";
import EatMeFirst from "../components/EatMeFirst.jsx";
import DishCard from "../components/DishCard.jsx";
import MysteryBox from "../components/MysteryBox.jsx";
import MenuTable from "../components/MenuTable.jsx";
import DishDialog from "../components/DishDialog.jsx";
import Toast from "../components/Toast.jsx";
import { Box, Plus } from "../components/icons.jsx";
import { useKitchen } from "../lib/store.js";
import {
  DAYS_LONG, TODAY, boxToDish, defaultDiners, freshness, fridgeHelpers, houseRules, mystery, rank, writeErr,
} from "../lib/fridge.js";

const Banner = ({ tone = "alert", children }) => (
  <div className={`border-l-2 py-2 pl-4 text-sm ${tone === "alert" ? "border-expired" : "border-accent"}`}>{children}</div>
);

const Empty = ({ children }) => (
  <div className="rounded-md border border-line p-8 text-center text-sm opacity-80">{children}</div>
);

export default function Dinner() {
  const k = useKitchen();
  const [day, setDay] = useState(TODAY);
  const [diners, setDiners] = useState(() => defaultDiners(TODAY));
  const [mins, setMins] = useState(45);
  const [mayaEggs, setMayaEggs] = useState(false);
  const [box, setBox] = useState(undefined); // undefined = closed, null = not enough in the fridge
  const [recipe, setRecipe] = useState(null);
  const [editing, setEditing] = useState(undefined); // undefined = closed, null = new dish
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();
  const resultsRef = useRef(null);

  const fridge = useMemo(() => fridgeHelpers(k.items), [k.items]);
  const ctx = { day, diners, mins, mayaEggs, items: k.items, fridge };
  const ranked = useMemo(() => rank(k.dishes, ctx), [k.dishes, day, diners, mins, mayaEggs, fridge]);
  const turning = k.items
    .filter((i) => i.have && i.useBy != null && freshness(i, day).status !== "fresh")
    .map((i) => ({ name: fridge.label(i.key) }));

  function flash(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }
  const pickDay = (d) => { setDay(d); setDiners(defaultDiners(d)); };
  const toggle = (who) => setDiners((s) => { const n = new Set(s); n.has(who) ? n.delete(who) : n.add(who); return n; });
  const saveItems = (next) => k.saveItems(next, (e) => flash(writeErr(e)));
  const shake = () => { setRecipe(null); setBox(mystery(ctx)); };

  async function saveDish(d, isEdit) {
    await k.saveDish(d);
    setEditing(undefined);
    flash(isEdit ? `Saved changes to ${d.name}.` : `Added ${d.name} to the menu.`);
  }
  async function deleteDish(d) {
    if (!confirm(`Delete "${d.name}" from the menu?`)) return;
    try { await k.removeDish(d.id); flash(`Deleted ${d.name}.`); } catch (e) { flash(writeErr(e)); }
  }
  async function saveBox() {
    const b = recipe?.steps ? { ...box, ...recipe } : box;
    try { await k.saveDish(boxToDish(b)); flash(`Dare accepted. ${box.title} is on the menu.`); } catch (e) { flash(writeErr(e)); }
  }
  async function askClaude() {
    if (!box || !k.sample) return;
    setRecipe({ loading: true });
    const rules = houseRules(diners);
    try {
      const r = await k.sample.json(`A family is doing a playful "mystery box" dinner dare. Make this combo actually taste good: "${box.title}" — ${box.line} Pantry staples are fine. House rules: ${rules.join("; ") || "none"}. Prep must fit in ${mins} minutes. Reply with only JSON: {"blurb": one fun sentence, "minutes": number, "steps": [3 to 5 short imperative steps]}.`, { modelTier: "quick" });
      setRecipe({ blurb: String(r.blurb || ""), mins: +r.minutes || box.mins, steps: (r.steps || []).slice(0, 5).map(String) });
    } catch (e) {
      if (e && e.code === "not_granted") { k.setSample(null); setRecipe(null); }
      else setRecipe({ error: e && e.code === "rate_limited" ? "Claude is busy right now. Try again in a minute." : "Couldn't get a recipe this time." });
    }
  }

  const recipeView = recipe && (
    recipe.loading ? <p className="m-0 text-sm italic opacity-70">Asking Claude…</p>
      : recipe.error ? <p className="m-0 text-sm">{recipe.error}</p>
        : (
          <div className="max-w-[62ch]">
            <p className="m-0">{recipe.blurb} <b className="font-semibold">About {recipe.mins} min.</b></p>
            <ol className="mt-2 mb-0 pl-5">{recipe.steps.map((s) => <li key={s}>{s}</li>)}</ol>
          </div>
        )
  );

  let results;
  if (!k.loaded) results = null;
  else if (!k.dishes.length) results = <Empty>The menu is empty. Use <b>Add a dinner</b> below, or open the mystery box and save a dare.</Empty>;
  else if (!diners.size) results = <Empty>Tap at least one name above to see dinner ideas.</Empty>;
  else if (!ranked.length) results = <Empty>Nothing on the menu works for this group tonight. Add a vegetarian, peanut-free dinner, or try the mystery box.</Empty>;
  else results = (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {ranked.slice(0, 3).map((r, i) => (
        <DishCard key={r.dish.id} rank={i + 1} result={r} mins={mins} label={fridge.label} has={fridge.has} />
      ))}
    </div>
  );
  const rest = ranked.slice(3, 6);

  return (
    <>
      <div className="grid grid-cols-1 items-end gap-8 border-b border-line pb-8 md:grid-cols-2">
        <h1 className="m-0 text-[44px] leading-none font-normal md:text-[64px]">What's for dinner?</h1>
        <div>
          <p className="m-0 max-w-[52ch] text-pretty">
            Built from the notes on the fridge door and what's on the shelves. Pick the night and who's eating, and the top three dinners update with the reasons they made the cut.
          </p>
          {k.status && <p className="mt-2 mb-0 text-xs opacity-60">{k.status}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <WhoPanel day={day} onDay={pickDay} diners={diners} onToggle={toggle} mins={mins} onMins={setMins} mayaEggs={mayaEggs} onMayaEggs={setMayaEggs} />
        <FridgePanel items={k.items} day={day} onChange={saveItems} />
      </div>

      {turning.length > 0 && (
        <div className="pb-8">
          <EatMeFirst items={turning} action="See what uses it" onAction={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })} />
        </div>
      )}

      <section ref={resultsRef} className="flex scroll-mt-4 flex-col gap-4 border-t border-line py-8" aria-labelledby="results-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow">{day === TODAY ? "Tonight" : DAYS_LONG[day]}</div>
            <h2 id="results-h" className="m-0 text-[32px]">Top 3 for {day === TODAY ? "tonight" : DAYS_LONG[day]}</h2>
          </div>
          <button className="btn btn-primary" onClick={shake}><Box />Open the mystery box</button>
        </div>

        {box !== undefined && (
          <MysteryBox box={box} recipe={recipeView} canAsk={!!k.sample} onAgain={shake} onAsk={askClaude} onSave={saveBox}
            onClose={() => { setBox(undefined); setRecipe(null); }} />
        )}

        {diners.has("theo") && (
          <Banner><b className="font-semibold text-expired">Theo has a serious peanut allergy.</b> His EpiPen is in his backpack. Read every label, including sauces, bread and frozen items.</Banner>
        )}
        {day === 5 && diners.has("jo") && (
          <Banner tone="accent">Saturday clash: Leo's tenders are saved for tonight, but Grandma Jo is vegetarian. These picks work for the whole table; the tenders can go on the side for the kids.</Banner>
        )}

        <div aria-live="polite">{results}</div>
        {rest.length > 0 && (
          <p className="m-0 text-sm opacity-75">
            <b className="font-semibold opacity-100">Also possible:</b> {rest.map((r) => `${r.dish.name} (${+r.dish.mins || 30} min)`).join(", ")}.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-4 border-t border-line py-8" aria-labelledby="menu-h">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="eyebrow">{k.dishes.length} dinners</div>
            <h2 id="menu-h" className="m-0 text-[32px]">The family menu</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {k.mode === "local" && (
              <button className="btn btn-ghost" onClick={() => { if (confirm("Reset the menu and fridge list to the starter set from the fridge photos?")) { k.resetKitchen(); flash("Back to the starter menu."); } }}>
                Reset to starter set
              </button>
            )}
            <button className="btn btn-primary" onClick={() => setEditing(null)}><Plus />Add a dinner</button>
          </div>
        </div>
        {k.loaded && <MenuTable dishes={k.dishes} onEdit={setEditing} onDelete={deleteDish} />}
      </section>

      <DishDialog dish={editing} items={k.items} label={fridge.label} onSave={saveDish} onClose={() => setEditing(undefined)} />
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[440px]">
          <Toast message={toast} onUndo={null} />
        </div>
      )}
    </>
  );
}
