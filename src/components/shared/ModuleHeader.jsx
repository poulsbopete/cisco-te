export function ModuleHeader({ title, subtitle, badge, badges, children }) {
  const badgeList = badges || (badge ? [badge] : []);
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-elastic-dark">{title}</h2>
          {badgeList.map((item) => {
            const label = typeof item === 'string' ? item : item.label;
            const tone = typeof item === 'string' ? 'default' : item.tone;
            const className = tone === 'action'
              ? 'bg-emerald-600 text-white'
              : tone === 'future'
                ? 'bg-violet-600 text-white'
                : 'bg-elastic-teal/10 text-elastic-teal';
            return (
              <span
                key={label}
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${className}`}
              >
                {label}
              </span>
            );
          })}
        </div>
        {subtitle && <p className="text-sm text-elastic-gray mt-1">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export function StatCard({ label, value, unit, trend, highlight }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-elastic-teal/5 border-elastic-teal/30' : 'bg-white border-gray-200'}`}>
      <p className="text-xs font-medium text-elastic-gray uppercase tracking-wide">{label}</p>
      <p className={`text-xl sm:text-2xl font-bold mt-1 ${highlight ? 'text-elastic-teal' : 'text-elastic-dark'}`}>
        {value}
        {unit && <span className="text-sm font-normal text-elastic-gray ml-1">{unit}</span>}
      </p>
      {trend && <p className="text-xs text-elastic-gray mt-1">{trend}</p>}
    </div>
  );
}

export default ModuleHeader;
