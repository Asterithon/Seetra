export const SingleHistogram = ({ data, label }) => {
  if (!data) return null;
  return (
    <div className="relative h-20 w-full border-t border-dark-border mt-2 pt-2 px-1 flex flex-col justify-end">
      <p className="absolute -top-3 left-1 text-[8px] font-bold text-slate-400 bg-dark-surface px-1">{label}</p>
      <img src={data} alt={`${label} Histogram`} className="w-full h-full object-contain mix-blend-screen opacity-90" />
    </div>
  );
};

export const RgbHistogram = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative h-20 w-full border-t border-dark-border mt-2 pt-2 px-1 flex flex-col justify-end">
      <p className="absolute -top-3 left-1 text-[8px] font-bold text-slate-400 bg-dark-surface px-1">RGB</p>
      <img src={data} alt="RGB Histogram" className="w-full h-full object-contain mix-blend-screen opacity-90" />
    </div>
  );
};

export const HsvHistogram = ({ data }) => {
  if (!data) return null;
  return (
    <div className="relative h-20 w-full border-t border-dark-border mt-2 pt-2 px-1 flex flex-col justify-end">
      <p className="absolute -top-3 left-1 text-[8px] font-bold text-slate-400 bg-dark-surface px-1">HSV</p>
      <img src={data} alt="HSV Histogram" className="w-full h-full object-contain mix-blend-screen opacity-90" />
    </div>
  );
};
