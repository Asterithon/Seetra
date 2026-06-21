export default function Select({ label, value, options, onChange }) {
  return (
    <div className="flex flex-col space-y-1 mb-4">
      <label className="text-sm font-medium text-slate-300">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-dark-bg border border-dark-border text-slate-200 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2 outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
