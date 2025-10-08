export const Card = ({title, children, className=""}) => (
  <section className={`glass rounded-2xl p-4 mb-4 ${className}`}>
    {title && <h3 className="font-semibold mb-2">{title}</h3>}
    {children}
  </section>
);

export const Input = (props) => (
  <input {...props}
    className={`w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm
                placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent ${props.className||""}`} />
);

export const Select = ({children, ...props}) => (
  <select {...props}
    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
    {children}
  </select>
);

export const Button = ({children, className="", ...props}) => (
  <button {...props}
    className={`tap w-full bg-accent hover:bg-violet-700 transition text-white font-semibold rounded-xl px-4 py-2.5 ${className}`}>
    {children}
  </button>
);

export const Stat = ({label, value, suffix=""}) => (
  <div className="glass rounded-xl p-3 text-center">
    <div className="text-xs text-white/60">{label}</div>
    <div className="text-xl font-bold">{value}{suffix}</div>
  </div>
);

export const Progress = ({value=0, max=100}) => {
  const pct = Math.min(100, Math.round((value/max)*100));
  return (
    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
      <div className="h-full bg-accent" style={{width: `${pct}%`}}/>
    </div>
  );
};

export const Pill = ({children}) => (
  <span className="text-[11px] px-2 py-1 rounded-full bg-white/10 border border-white/10">{children}</span>
);
