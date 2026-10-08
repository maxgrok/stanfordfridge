export default function EatMeFirst({ items }) {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-6 gap-y-3 border-y border-accent py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]">
      <div className="font-heading text-[54px] leading-none font-normal text-accent tnum">{items.length}</div>
      <div>
        <div className="font-heading text-[22px] leading-tight font-semibold">
          {items.length === 1 ? "thing would" : "things would"} love to be eaten soon
        </div>
        <div className="mt-[2px] text-[13px] opacity-75">{items.map((i) => i.name).join(", ") || "Nothing urgent. Nice work."}</div>
      </div>
      <button className="btn btn-primary col-span-2 justify-self-start sm:col-span-1">Find a recipe</button>
    </div>
  );
}
