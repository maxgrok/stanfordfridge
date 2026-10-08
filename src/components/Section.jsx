export default function Section({ n, title, note, last, children }) {
  return (
    <section className={`grid grid-cols-1 gap-8 py-8 md:grid-cols-[200px_minmax(0,1fr)] ${last ? "" : "border-b border-line"}`}>
      <div>
        <div className="eyebrow">{n}</div>
        <h2 className="mt-1 mb-0 text-[30px]">{title}</h2>
        {note && <p className="mt-2 text-[13px] opacity-70">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export const Label = ({ children }) => <h6 className="m-0 opacity-60">{children}</h6>;
