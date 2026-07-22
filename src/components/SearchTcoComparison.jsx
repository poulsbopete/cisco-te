import { useMemo, useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { PiggyBank, Server, TrendingDown } from 'lucide-react';
import {
  compareSearchTco,
  DEFAULT_TCO_INPUTS,
  formatUsdCompact,
  formatUsdFull,
  OSS_VS_SERVERLESS_ADVANTAGES,
  TCO_MODEL_DISCLAIMER,
} from '../utils/search-tco-model';
import { StatCard } from './shared/ModuleHeader';

const OSS_COLOR = '#69707d';
const SERVERLESS_COLOR = '#00bfb3';

export function SearchTcoComparison() {
  const [hotCorpusTb, setHotCorpusTb] = useState(DEFAULT_TCO_INPUTS.hotCorpusTb);
  const [federatedArchivePb, setFederatedArchivePb] = useState(DEFAULT_TCO_INPUTS.federatedArchivePb);
  const [opsFte, setOpsFte] = useState(DEFAULT_TCO_INPUTS.opsFte);
  const [archiveIndexedFraction, setArchiveIndexedFraction] = useState(
    DEFAULT_TCO_INPUTS.archiveIndexedFraction,
  );

  const comparison = useMemo(
    () => compareSearchTco({
      hotCorpusTb,
      federatedArchivePb,
      opsFte,
      archiveIndexedFraction,
    }),
    [hotCorpusTb, federatedArchivePb, opsFte, archiveIndexedFraction],
  );

  const chartData = [
    { name: 'Open source (self-managed)', total: comparison.oss.total, fill: OSS_COLOR },
    { name: 'Serverless Search + federation', total: comparison.serverless.total, fill: SERVERLESS_COLOR },
  ];

  return (
    <section className="rounded-xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/30 via-white to-gray-50 overflow-hidden">
      <div className="p-4 border-b border-emerald-100 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-emerald-800">Illustrative TCO</p>
          <h3 className="text-sm font-semibold text-elastic-dark mt-0.5">
            Open-source Elastic vs Serverless Search + federated blob
          </h3>
          <p className="text-xs text-elastic-gray mt-1 max-w-2xl">{TCO_MODEL_DISCLAIMER}</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-success bg-success/10 border border-success/20 rounded-lg px-3 py-2">
          <TrendingDown className="w-4 h-4" />
          ~{Math.round(comparison.savingsPct)}% lower modeled TCO · {formatUsdCompact(comparison.savingsUsd)}/yr
        </div>
      </div>

      <div className="p-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <SliderField
            id="hot-tb"
            label="Hot Search corpus (TB)"
            value={hotCorpusTb}
            min={5}
            max={120}
            step={1}
            onChange={setHotCorpusTb}
            hint="Recent KB, portals, and interactive corpora on managed indices."
          />
          <SliderField
            id="fed-pb"
            label="Archive in blob (PB)"
            value={federatedArchivePb}
            min={0.1}
            max={5}
            step={0.1}
            onChange={setFederatedArchivePb}
            hint="Exports, compliance bundles, and historical docs in object storage."
          />
          <SliderField
            id="ops-fte"
            label="Platform FTE on Elasticsearch"
            value={opsFte}
            min={0.5}
            max={8}
            step={0.5}
            onChange={setOpsFte}
            hint="SRE + platform engineering touching clusters, ILM, and upgrades."
          />
          <SliderField
            id="archive-frac"
            label="Archive kept search-ready on OSS today"
            value={Math.round(archiveIndexedFraction * 100)}
            min={10}
            max={100}
            step={5}
            onChange={(v) => setArchiveIndexedFraction(v / 100)}
            unit="%"
            hint="Higher % = more self-managed frozen/searchable snapshot cost before federation."
          />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatCard
              label="Open source TCO"
              value={formatUsdCompact(comparison.oss.total)}
              trend={formatUsdFull(comparison.oss.total)}
            />
            <StatCard
              label="Serverless TCO"
              value={formatUsdCompact(comparison.serverless.total)}
              trend={formatUsdFull(comparison.serverless.total)}
              highlight
            />
            <StatCard
              label="Modeled savings"
              value={`${Math.round(comparison.savingsPct)}%`}
              trend={`${formatUsdFull(comparison.savingsUsd)} / year`}
              highlight
            />
          </div>

          <div className="h-52 rounded-xl border border-gray-200 bg-white p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => formatUsdCompact(v)} />
                <Tooltip formatter={(v) => formatUsdFull(v)} />
                <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <CostBreakdown title="Open source cost stack" lines={comparison.oss.lines} accent="border-gray-200" />
            <CostBreakdown title="Serverless + federation" lines={comparison.serverless.lines} accent="border-elastic-teal/40" highlight />
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 grid md:grid-cols-2 gap-3">
        {OSS_VS_SERVERLESS_ADVANTAGES.map((item) => (
          <div key={item.title} className="p-3 rounded-lg border border-gray-200 bg-white flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              {item.title.includes('TCO') || item.title.includes('Predictable') ? (
                <PiggyBank className="w-4 h-4 text-emerald-700" />
              ) : (
                <Server className="w-4 h-4 text-emerald-700" />
              )}
            </div>
            <div>
              <p className="text-xs font-semibold text-elastic-dark">{item.title}</p>
              <p className="text-[11px] text-elastic-gray mt-1 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SliderField({
  id, label, value, min, max, step, onChange, hint, unit = '',
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-elastic-dark flex justify-between gap-2">
        <span>{label}</span>
        <span className="text-elastic-teal tabular-nums">{value}{unit}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full mt-2 accent-elastic-teal"
      />
      {hint && <p className="text-[10px] text-elastic-gray mt-1 leading-snug">{hint}</p>}
    </div>
  );
}

function CostBreakdown({ title, lines, accent, highlight = false }) {
  const total = lines.reduce((sum, line) => sum + line.value, 0);
  return (
    <div className={`rounded-xl border ${accent} bg-white p-3 ${highlight ? 'bg-elastic-teal/5' : ''}`}>
      <p className="text-[10px] uppercase tracking-wide font-semibold text-elastic-gray">{title}</p>
      <ul className="mt-2 space-y-1.5">
        {lines.map((line) => (
          <li key={line.id} className="flex justify-between gap-2 text-[11px]">
            <span className="text-elastic-gray">{line.label}</span>
            <span className="font-medium text-elastic-dark tabular-nums shrink-0">{formatUsdCompact(line.value)}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs font-bold text-elastic-dark mt-2 pt-2 border-t border-gray-100 flex justify-between">
        <span>Total</span>
        <span>{formatUsdFull(total)}</span>
      </p>
    </div>
  );
}

export default SearchTcoComparison;
