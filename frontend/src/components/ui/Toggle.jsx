export default function Toggle({ label, checked, onChange, disabled }) {
  return (
    <div className={`flex items-center justify-between mb-4 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <label className={`relative inline-flex items-center ${disabled ? 'pointer-events-none' : 'cursor-pointer'}`}>
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked} 
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)} 
        />
        <div className="w-11 h-6 bg-dark-bg peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-dark-border"></div>
      </label>
    </div>
  );
}
