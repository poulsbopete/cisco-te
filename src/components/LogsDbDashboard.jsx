import { useMemo, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Copy, Check, Cpu, Database, FileCode2, Sparkles } from 'lucide-react';
import { ModuleHeader, StatCard } from './shared/ModuleHeader';
import {
  COMPARISON_MODES,
  DEFAULT_LOG_VOLUME_PB,
  INDEX_TEMPLATE_SNIPPET,
  LOGSDB_SAVINGS,
  estimateAnnualStorageCost,
  formatPb,
  formatUsdMillions,
} from '../utils/storage-scenarios';

export function LogsDbDashboard() {
  const [pbStored, setPbStored] = useState(DEFAULT_LOG_VOLUME_PB);
  const [copied, setCopied] = useState(false);

  const savingsPct = LOGSDB_SAVINGS.conservative;
  const beforeCost = estimateAnnualStorageCost(pbStored, { savingsPct: 0 });
  const afterCost = estimateAnnualStorageCost(pbStored, { savingsPct });
  const saved = beforeCost - afterCost;

  const chartData = useMemo(
    () => COMPARISON_MODES.map((m) => ({
      name: m.label.replace(' + ', '\n+ '),
      pb: Number((pbStored * m.relativeSize).toFixed(2)),
      mode: m.id,
    })),
    [pbStored],
  );

  async function copyTemplate() {
    try {
      await navigator.clipboard.writeText(INDEX_TEMPLATE_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-6">
      <ModuleHeader
        title="LogsDB & compression on Elastic Cloud Hosted"
        subtitle="Index-template change only — no application redeploy. Typical ~30% disk savings; up to ~80% on log-heavy workloads."
        badges={[{ label: 'Deploy today', tone: 'action' }]}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="On-disk reduction" value="~30%" highlight trend={LOGSDB_SAVINGS.label} />
        <StatCard label="Code changes" value="0" unit="required" trend="Template + ILM policy updates" />
        <StatCard label="Trade-off" value="+CPU" unit="indexing" trend="Index sorting for logsdb mode" />
        <StatCard
          label="Estimated savings"
          value={formatUsdMillions(saved / 1_000_000)}
          highlight
          trend={`At ${formatPb(pbStored)} stored (illustrative)`}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <label htmlFor="pb-slider" className="text-sm font-semibold text-elastic-dark flex items-center gap-2">
            <Database className="w-4 h-4 text-elastic-teal" />
            Stored log volume (scenario)
          </label>
          <input
            id="pb-slider"
            type="range"
            min={0.5}
            max={8}
            step={0.1}
            value={pbStored}
            onChange={(e) => setPbStored(Number(e.target.value))}
            className="w-full mt-3 accent-elastic-teal"
          />
          <p className="text-sm font-bold text-elastic-teal mt-2">{formatPb(pbStored)} on standard indices</p>
          <p className="text-xs text-elastic-gray mt-1">
            With LogsDB + best_compression (~30%):{' '}
            <strong>{formatPb(pbStored * (1 - savingsPct))}</strong> effective footprint
          </p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-elastic-dark">Why this matters before scaling events</p>
              <p className="text-xs text-elastic-gray leading-relaxed mt-1">
                Disk-triggered auto-scale at high utilization forces vertical tier jumps or doubled node counts.
                Shrinking indexed bytes extends runway on the same hardware profile and delays expensive cluster growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-elastic-dark mb-3">Relative on-disk footprint by configuration</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11 }} unit=" PB" />
              <Tooltip formatter={(v) => [`${v} PB`, 'Stored']} />
              <Bar dataKey="pb" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={entry.mode}
                    fill={entry.mode === 'standard' ? '#69707d' : entry.mode === 'logsdb' ? '#00bfb3' : '#2b6cb0'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 bg-gray-900 text-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-gray-800/80">
            <span className="text-xs font-semibold flex items-center gap-2">
              <FileCode2 className="w-3.5 h-3.5" />
              Index template (new indices)
            </span>
            <button
              type="button"
              onClick={copyTemplate}
              className="text-[10px] font-medium px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 flex items-center gap-1"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-4 text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap">{INDEX_TEMPLATE_SNIPPET}</pre>
        </div>

        <div className="space-y-3">
          <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/50">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-4 h-4 text-amber-700" />
              <h3 className="text-sm font-semibold text-elastic-dark">Operational notes</h3>
            </div>
            <ul className="text-xs text-elastic-gray space-y-2 list-disc pl-4">
              <li>Apply to <strong>new</strong> indices via template; reindex or rollover to migrate existing data.</li>
              <li>Validate search latency and indexing throughput in a representative index before fleet-wide rollout.</li>
              <li>Pair with ILM: hot for incident window → searchable snapshot / frozen for compliance-age data.</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 bg-white text-xs text-elastic-gray leading-relaxed">
            <strong className="text-elastic-dark">Commercial cloud pilot:</strong> Test logsdb + best_compression on a
            representative index first — same Elasticsearch APIs, lower storage pressure, before rolling templates fleet-wide
            or depending on newer IO-optimized instance profiles in restricted regions.
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogsDbDashboard;
