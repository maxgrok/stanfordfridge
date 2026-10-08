import { useMemo, useRef, useState } from "react";
import Section, { Label } from "../components/Section.jsx";
import Seg from "../components/Seg.jsx";
import ExpiryBadge from "../components/ExpiryBadge.jsx";
import QuantityStepper from "../components/QuantityStepper.jsx";
import EatMeFirst from "../components/EatMeFirst.jsx";
import Inventory from "../components/Inventory.jsx";
import AddItemDialog from "../components/AddItemDialog.jsx";
import Toast from "../components/Toast.jsx";
import { Plus, Search, Trash } from "../components/icons.jsx";
import { expiry, sampleItems, startOfToday } from "../data/items.js";

const Swatch = ({ name, token, style }) => (
  <div className="flex flex-col gap-[6px]">
    <div className="h-14 rounded-md" style={style} />
    <div className="text-[13px]">{name}</div>
    <code className="text-[11px] opacity-60">{token}</code>
  </div>
);

const Status = ({ name, token, color, children }) => (
  <div className="flex flex-col gap-2 border-t-2 pt-3" style={{ borderColor: `var(${token})` }}>
    <div className={`font-heading text-xl font-semibold ${color}`}>{name}</div>
    <div className="text-[13px] opacity-80">{children}</div>
    <code className="text-[11px] opacity-60">{token}</code>
  </div>
);

const CODE_CONFIG = `/* index.css — Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

@theme inline {
  --color-bg: var(--color-bg);
  --color-surface: var(--color-surface);
  --color-ink: var(--color-text);
  --color-line: var(--color-divider);
  --color-accent: var(--color-accent);
  --color-fresh: var(--fridge-fresh);
  --color-soon: var(--fridge-soon);
  --color-expired: var(--fridge-expired);
  --font-heading: var(--font-heading);
  --font-body: var(--font-body);
  --radius: var(--radius-md);
}`;

const CODE_TOKENS = `/* tokens.css — after Classical's styles */
:root {
  --fridge-fresh: #4f6b44;
  --fridge-soon: #8a5d17;
  --fridge-expired: #9a3b2e;
}
.dark {
  --color-bg: #1a1816;
  --color-surface: #24211e;
  --color-text: #ece7e1;
  --color-accent: #d29e55;
  --color-divider: rgb(236 231 225 / .16);
  --fridge-fresh: #9fb98f;
  --fridge-soon: #e1ad66;
  --fridge-expired: #e08a7b;
}

// Rules
// · accent is a stroke, never a fill
// · status = colour + dot shape (+ italic)
// · warm copy: "Use by tomorrow",
//   not "EXPIRES 10/08"`;

const Pre = ({ children }) => (
  <pre className="m-0 overflow-auto rounded-md border border-line p-4 font-mono text-xs leading-relaxed whitespace-pre">{children}</pre>
);

export default function DesignSystem() {
  const [raw, setRaw] = useState(() => sampleItems());
  const [qty, setQty] = useState(6);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef();

  const today = startOfToday();
  const items = useMemo(() => raw.map((i) => expiry(i, today)).sort((a, b) => a.days - b.days), [raw, today.getTime()]);
  const soon = items.filter((i) => i.status !== "fresh");

  function flash(message, undo) {
    clearTimeout(toastTimer.current);
    setToast({ message, undo });
    toastTimer.current = setTimeout(() => setToast(null), 5000);
  }
  function markUsed(it) {
    const before = raw;
    setRaw((r) => r.filter((x) => x.id !== it.id));
    flash(`${it.name} is used up.`, () => { setRaw(before); setToast(null); });
  }
  function add(it) {
    setRaw((r) => [...r, { ...it, id: Date.now() }]);
    setAdding(false);
    flash(`${it.name} is tucked into the ${it.zone.toLowerCase()}.`, null);
  }

  return (
    <>
      <main className="mx-auto max-w-[1200px] px-4 pt-8 pb-24 md:px-8">
        <div className="grid grid-cols-1 items-end gap-8 border-b border-line pb-8 md:grid-cols-2">
          <h1 className="m-0 text-[44px] leading-none font-normal md:text-[64px]">A home for everything<br />in the fridge.</h1>
          <p className="m-0 max-w-[52ch] text-justify hyphens-auto text-pretty">
            Fridge is built on Classical: quiet paper, serif headings, colour drawn as a line rather than poured in. On top of that sits one small vocabulary of its own — three freshness colours and the pieces that help a household see what to eat first.
          </p>
        </div>

        <Section n="01" title="Tokens">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Swatch name="Ground" token="--color-bg" style={{ background: "var(--color-bg)", border: "1px solid var(--color-divider)" }} />
              <Swatch name="Surface" token="--color-surface" style={{ background: "var(--color-surface)", border: "1px solid var(--color-divider)" }} />
              <Swatch name="Ink" token="--color-text" style={{ background: "var(--color-text)" }} />
              <Swatch name="Accent — stroke only" token="--color-accent" style={{ border: "2px solid var(--color-accent)" }} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Status name="Fresh" token="--fridge-fresh" color="text-fresh">More than three days to go. No rush.</Status>
              <Status name="Eat soon" token="--fridge-soon" color="text-soon">Three days or fewer. Shares the accent's warmth.</Status>
              <Status name="Past its date" token="--fridge-expired" color="text-expired">Set in italic too, so it never relies on colour alone.</Status>
            </div>
            <div className="grid grid-cols-1 gap-6 border-t border-line pt-4 sm:grid-cols-2">
              <div>
                <div className="mb-[6px] text-[11px] tracking-[.08em] uppercase opacity-60">Heading · Cormorant Garamond</div>
                <div className="font-heading text-[34px] leading-[1.1]">What's for dinner tonight?</div>
              </div>
              <div>
                <div className="mb-[6px] text-[11px] tracking-[.08em] uppercase opacity-60">Body · Lora</div>
                <p className="m-0 text-[15px]">Half a bag of spinach, two eggs and some cheddar. That's an omelette waiting to happen.</p>
              </div>
            </div>
          </div>
        </Section>

        <Section n="02" title="Core" note="Classical's own parts, unchanged. Use them as they are.">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label>Buttons</Label>
              <div className="flex flex-wrap items-center gap-2">
                <button className="btn btn-primary" onClick={() => setAdding(true)}><Plus />Add item</button>
                <button className="btn btn-secondary">Cancel</button>
                <button className="btn btn-ghost">Undo</button>
                <button className="btn btn-secondary btn-icon" aria-label="Remove"><Trash /></button>
                <button className="btn btn-primary" disabled>Saving…</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                <span className="tag tag-accent">Opened</span>
                <span className="tag tag-neutral">Dairy</span>
                <span className="tag tag-outline">Shared</span>
                <span className="tag tag-neutral">Top shelf</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Fields</Label>
              <div className="field"><label htmlFor="f-what">What is it?</label><input id="f-what" className="input" placeholder="e.g. Oat milk" /></div>
              <div className="field"><label htmlFor="f-search">Search</label>
                <div className="relative">
                  <Search className="absolute top-[10px] left-[10px] opacity-55" />
                  <input id="f-search" className="input pl-8" placeholder="Find something tasty…" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Choices</Label>
              <Seg name="core-sort" className="self-start" defaultValue="Use-by" options={["Use-by", "Name", "Recently added"]} />
              <div className="flex flex-wrap gap-4">
                <label className="radio"><input type="radio" name="core-r" defaultChecked /><span className="dot" />Just me</label>
                <label className="radio"><input type="radio" name="core-r" /><span className="dot" />Whole household</label>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" defaultChecked className="m-0 size-4 accent-accent" />Remind me the day before
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Card</Label>
              <div className="card">
                <div className="card-kicker">Tonight's idea</div>
                <div className="card-title">Spinach &amp; cheddar omelette</div>
                <p className="card-body">Uses three things that would love to be eaten this week.</p>
                <div className="card-meta">15 minutes · Serves 2</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Toast</Label>
              <Toast message="Chicken thighs are tucked into the freezer." onUndo={() => {}} />
            </div>

            <div className="col-span-full flex flex-col gap-3">
              <Label>Dialog</Label>
              <div className="grid place-items-center rounded-lg p-4 sm:p-8" style={{ background: "color-mix(in srgb, var(--color-neutral-900) 38%, transparent)" }}>
                <AddItemDialog inline onClose={() => {}} />
              </div>
            </div>
          </div>
        </Section>

        <Section n="03" title="Fridge parts" note="Built from the core, only for this app.">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label>Expiry badge</Label>
              <div className="flex flex-wrap gap-2">
                <ExpiryBadge status="fresh" label="9 days left" />
                <ExpiryBadge status="soon" label="Use by tomorrow" />
                <ExpiryBadge status="expired" label="Expired yesterday" />
                <ExpiryBadge status="none" label="No date" />
              </div>
              <p className="m-0 text-xs opacity-65">Outline and a dot, never a fill. Expired swaps the dot for a ring and sets in italic.</p>
            </div>

            <div className="flex flex-col gap-3">
              <Label>Quantity stepper</Label>
              <QuantityStepper value={qty} onChange={setQty} />
              <p className="m-0 text-xs opacity-65">
                {qty === 0 ? "All gone — we'll add eggs to the shopping list." : "Tap to adjust. Hitting zero offers to restock."}
              </p>
            </div>

            <div className="col-span-full flex flex-col gap-3">
              <Label>Eat-me-first strip</Label>
              <EatMeFirst items={soon} />
            </div>

            <div className="col-span-full flex flex-col gap-4">
              <Label>Inventory · zone tabs, category chips, item card &amp; item row</Label>
              <Inventory items={items} onUse={markUsed} onAdd={() => setAdding(true)} />
            </div>
          </div>
        </Section>

        <Section n="04" title="In code" note="React + Tailwind. Every colour points at a variable, so dark mode is one class on html." last>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Pre>{CODE_CONFIG}</Pre>
            <Pre>{CODE_TOKENS}</Pre>
          </div>
        </Section>
      </main>

      <AddItemDialog open={adding} onClose={() => setAdding(false)} onSave={add} />
      {toast && (
        <div className="fixed inset-x-4 bottom-4 z-10 mx-auto max-w-[440px]">
          <Toast message={toast.message} onUndo={toast.undo ?? null} />
        </div>
      )}
    </>
  );
}
