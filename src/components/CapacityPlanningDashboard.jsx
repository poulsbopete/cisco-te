import {
  Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertTriangle, HardDrive, Scale, TrendingUp } from 'lucide-react';
import { ModuleHeader, StatCard } from './shared/ModuleHeader';
import { AUTOSCALE_FACTS } from '../utils/storage-scenarios';

const DISK_SERIES = [
  { week: 'W1', disk: 62, shards: 420 },
  { week: 'W2', disk: 68, shards: 510 },
  { week: 'W3', disk: 74, shards: 620 },
  { week: 'W4', disk: 79, shards: 710 },
  { week: 'W5', disk: 83, shards: 820 },
  { week: 'W6', disk: 86, shards: 910 },
  { week: 'W7', disk: 88, shards: 980 },
  { week: 'W8', disk: 84, shards: 940 },
];

const severityStyles = {
  warning: 'border-amber-200 bg-amber-50/60',
  danger: 'border-danger/30 bg-red-50/50',
  neutral: 'border-gray-200 bg-white',
};

export function CapacityPlanningDashboard() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Capacity planning & tier strategy"
        subtitle="When disk policies lag shard and CPU pressure, teams see yellow cluster health and surprise vertical scale-outs."
        badge="Hosted cloud"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Auto-scale trigger" value="~85%" unit="disk" trend="Often late for ops teams wanting 70% headroom" />
        <StatCard label="Vertical ceiling" value="58 GB" unit="RAM/zone" trend="Then horizontal data-node adds" />
        <StatCard label="Masters appear" value="6" unit="data nodes" trend="Dedicated masters auto-provisioned" />
        <StatCard label="Shard guardrail" value="1k" unit="/ node" trend="Not in storage-only policies" highlight />
      </div>

      <div className="p-4 rounded-xl border border-gray-200 bg-white">
        <h3 className="text-sm font-semibold text-elastic-dark mb-1 flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-elastic-teal" />
          Disk utilization vs. shard pressure (illustrative)
        </h3>
        <p className="text-xs text-elastic-gray mb-3">
          After W6 the autoscaler adds capacity — hourly cost can jump before shard balance recovers (W8).
        </p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DISK_SERIES} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="diskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5a700" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f5a700" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="disk" domain={[50, 100]} tick={{ fontSize: 11 }} unit="%" />
              <YAxis yAxisId="shards" orientation="right" tick={{ fontSize: 11 }} />
              <Tooltip />
              <ReferenceLine yAxisId="disk" y={85} stroke="#bd271e" strokeDasharray="4 4" label={{ value: '85% trigger', fontSize: 10, fill: '#bd271e' }} />
              <Area yAxisId="disk" type="monotone" dataKey="disk" stroke="#f5a700" fill="url(#diskGrad)" name="Disk %" />
              <Area yAxisId="shards" type="monotone" dataKey="shards" stroke="#69707d" fill="transparent" name="Shard load index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {AUTOSCALE_FACTS.map((fact) => (
          <div key={fact.title} className={`p-4 rounded-xl border ${severityStyles[fact.severity]}`}>
            <p className="text-sm font-semibold text-elastic-dark flex items-center gap-2">
              {fact.severity === 'danger' && <AlertTriangle className="w-4 h-4 text-danger" />}
              {fact.severity === 'warning' && <TrendingUp className="w-4 h-4 text-warning" />}
              {fact.severity === 'neutral' && <Scale className="w-4 h-4 text-elastic-gray" />}
              {fact.title}
            </p>
            <p className="text-xs text-elastic-gray mt-2 leading-relaxed">{fact.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border border-elastic-teal/30 bg-elastic-teal/5">
          <h3 className="text-sm font-semibold text-elastic-dark">1 · Right-size bytes</h3>
          <p className="text-xs text-elastic-gray mt-2 leading-relaxed">
            LogsDB + best_compression reduces bytes indexed — fewer scale events for the same ingest rate.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-brand-accent/30 bg-blue-50/40">
          <h3 className="text-sm font-semibold text-elastic-dark">2 · ILM to object tier</h3>
          <p className="text-xs text-elastic-gray mt-2 leading-relaxed">
            Move aged telemetry to searchable snapshots / frozen — keep hot tier for incident windows only.
          </p>
        </div>
        <div className="p-4 rounded-xl border border-violet-200/70 bg-violet-50/40">
          <h3 className="text-sm font-semibold text-elastic-dark">3 · Search on blob (future)</h3>
          <p className="text-xs text-elastic-gray mt-2 leading-relaxed">
            Enterprise Search Serverless + federated data sources for KB and archive corpora in object storage — separate from telemetry pipelines.
          </p>
        </div>
      </div>
    </div>
  );
}

export default CapacityPlanningDashboard;
