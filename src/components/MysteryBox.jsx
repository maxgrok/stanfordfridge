/** Mystery-box dare, drawn as an accent-ruled strip like the eat-me-first part. */
export default function MysteryBox({ box, recipe, canAsk, onAgain, onAsk, onSave, onClose }) {
  if (!box) {
    return (
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-accent py-4">
        <p className="m-0">There isn't enough in the fridge to build a dare. Check off a few more items.</p>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    );
  }
  return (
    <section aria-label="Mystery box dare" className="flex flex-col gap-2 border-y border-accent py-5 motion-safe:animate-[shake_.45s_ease-in-out]">
      <div className="flex items-center gap-3">
        <span className="card-kicker">Mystery box dare</span>
        <span className="flex gap-1" role="img" aria-label={`Weirdness ${box.heat} of 3`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={`size-[7px] rounded-full ${n <= box.heat ? "bg-accent" : "border border-accent"}`} />
          ))}
        </span>
      </div>
      <h3 className="m-0 text-[clamp(28px,5vw,40px)] leading-none font-normal">{box.title}</h3>
      <p className="m-0 max-w-[62ch]">{box.line}</p>
      <p className="m-0 max-w-[62ch]"><b className="font-semibold">The dare:</b> {box.dare}</p>
      {box.notes.map((n) => <p key={n} className="m-0 max-w-[62ch] text-sm opacity-80">{n}</p>)}
      {recipe}
      <div className="mt-2 flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={onAgain}>Shake it again</button>
        {canAsk && <button className="btn btn-secondary" onClick={onAsk}>Ask Claude how to make it</button>}
        <button className="btn btn-secondary" onClick={onSave}>Add to the menu</button>
        <button className="btn btn-ghost" onClick={onClose}>Close</button>
      </div>
    </section>
  );
}
