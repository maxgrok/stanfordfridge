/** Classical segmented control. Pass `value` + `onChange` for controlled use. */
export default function Seg({ name, options, value, defaultValue, onChange, className = "" }) {
  return (
    <div className={`seg ${className}`} role="radiogroup">
      {options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        const checked = value !== undefined ? { checked: value === opt.value, onChange: () => onChange?.(opt.value) } : { defaultChecked: defaultValue === opt.value };
        return (
          <label key={opt.value} className="seg-opt">
            <input type="radio" name={name} {...checked} />
            {opt.icon}
            {opt.label}
          </label>
        );
      })}
    </div>
  );
}
