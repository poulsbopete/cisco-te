import {
  ArrowRight,
  Cloud,
  Database,
  FileText,
  GitBranch,
  Layers,
  Search,
  Sparkles,
  Upload,
} from 'lucide-react';
import { FEDERATED_ARCHITECTURE, FEDERATED_SEARCH_USE_CASES } from '../utils/storage-scenarios';
import { ModuleHeader } from './shared/ModuleHeader';

const INPUT_ICONS = {
  managed: FileText,
  connectors: Upload,
  archive: Database,
};

const DESTINATION_ICONS = {
  unified: Search,
  admin: Cloud,
};

function StatusPill({ status }) {
  const good = status === 'Good' || status === 'Healthy';
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
        good ? 'bg-success/15 text-success' : 'bg-gray-100 text-elastic-gray'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${good ? 'bg-success' : 'bg-elastic-gray'}`} />
      {status}
    </span>
  );
}

function FlowLine({ className = '' }) {
  return (
    <div className={`hidden lg:flex items-center justify-center shrink-0 px-1 ${className}`} aria-hidden>
      <div className="h-px w-6 bg-gradient-to-r from-gray-300 to-indigo-300" />
      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 -ml-0.5" />
    </div>
  );
}

function NodeCard({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-gray-200 bg-white shadow-sm p-3 min-w-0 ${className}`}>
      {children}
    </div>
  );
}

export function FederatedArchitectureDiagram() {
  const arch = FEDERATED_ARCHITECTURE;

  return (
    <section className="rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50/40 via-white to-indigo-50/30 overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 p-4 border-b border-violet-100">
        <div className="flex items-start gap-2">
          <div className="w-9 h-9 rounded-lg bg-violet-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-white" aria-hidden />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wide font-bold text-violet-700">{arch.badge}</p>
            <h3 className="text-sm font-semibold text-elastic-dark mt-0.5">{arch.title}</h3>
            <p className="text-xs text-elastic-gray mt-1 max-w-2xl leading-relaxed">{arch.subtitle}</p>
          </div>
        </div>
        <p className="text-[10px] text-indigo-900/80 max-w-xs leading-relaxed bg-indigo-50/80 border border-indigo-100 rounded-lg px-2.5 py-2">
          {arch.compareNote}
        </p>
      </div>

      <div className="hidden lg:block p-4 overflow-x-auto">
        <div className="flex items-stretch min-w-[960px] gap-0">
          <div className="flex flex-col gap-2 w-[168px] shrink-0">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-elastic-gray mb-1">Sources</p>
            {arch.inputs.map((input) => {
              const Icon = INPUT_ICONS[input.id] || Cloud;
              return (
                <NodeCard key={input.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span className="text-xs font-semibold text-elastic-dark truncate">{input.label}</span>
                  </div>
                  <p className="text-[10px] text-elastic-gray mt-1 leading-snug">{input.detail}</p>
                  <p className="text-[10px] font-medium text-indigo-700 mt-1.5 tabular-nums">{input.rate}</p>
                  <div className="mt-2">
                    <StatusPill status="Healthy" />
                  </div>
                </NodeCard>
              );
            })}
          </div>

          <FlowLine className="self-center pt-6" />

          <div className="flex flex-col gap-3 w-[220px] shrink-0 pt-5">
            <NodeCard className="border-violet-200 bg-violet-50/30">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-violet-700" />
                <span className="text-xs font-semibold text-elastic-dark">{arch.controlPlane.label}</span>
              </div>
              <p className="text-[10px] text-elastic-gray mt-1">{arch.controlPlane.detail}</p>
              <div className="mt-2">
                <StatusPill status={arch.controlPlane.status} />
              </div>
            </NodeCard>

            <NodeCard className="border-emerald-200/70 relative">
              <div className="absolute -top-2 left-3 px-1.5 py-0.5 rounded bg-emerald-600 text-[9px] font-bold text-white uppercase tracking-wide">
                Federation
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Layers className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-semibold text-elastic-dark">{arch.federation.label}</span>
              </div>
              <p className="text-[10px] text-elastic-gray mt-1">{arch.federation.detail}</p>
              <div className="mt-3 space-y-2">
                {arch.federation.routes.map((route) => (
                  <div
                    key={route.id}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-2 py-1.5 text-[10px] ${
                      route.accent === 'emerald'
                        ? 'border-emerald-200 bg-emerald-50/80'
                        : 'border-gray-200 bg-gray-50/80'
                    }`}
                  >
                    <span className="flex items-center gap-1 font-semibold text-elastic-dark">
                      <GitBranch className="w-3 h-3 text-emerald-600" />
                      {route.label}
                    </span>
                    <span className="text-elastic-gray text-right">{route.share}</span>
                  </div>
                ))}
              </div>
            </NodeCard>
          </div>

          <FlowLine className="self-center pt-6" />

          <div className="flex flex-col gap-2 w-[200px] shrink-0 pt-5">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-elastic-gray mb-1">Search tiers</p>
            {arch.storage.map((tier) => (
              <NodeCard key={tier.id} className="border-elastic-teal/30">
                <div className="flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-elastic-teal" />
                  <span className="text-xs font-semibold text-elastic-dark">{tier.label}</span>
                </div>
                <p className="text-[10px] text-elastic-gray mt-1">{tier.detail}</p>
                <p className="text-[10px] font-medium text-elastic-teal mt-1.5 tabular-nums">{tier.metrics}</p>
                <div className="mt-2">
                  <StatusPill status={tier.status} />
                </div>
              </NodeCard>
            ))}
          </div>

          <FlowLine className="self-center pt-6" />

          <div className="flex flex-col gap-2 w-[188px] shrink-0 pt-5">
            <p className="text-[10px] uppercase tracking-wide font-semibold text-elastic-gray mb-1">Outcomes</p>
            {arch.destinations.map((dest) => {
              const DestIcon = DESTINATION_ICONS[dest.id] || Search;
              return (
              <NodeCard key={dest.id}>
                <div className="flex items-center gap-2">
                  <DestIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="text-xs font-semibold text-elastic-dark">{dest.label}</span>
                </div>
                <p className="text-[10px] text-elastic-gray mt-1">{dest.detail}</p>
                <div className="mt-2">
                  <StatusPill status="Good" />
                </div>
              </NodeCard>
            );
            })}
          </div>
        </div>

        <NodeCard className="relative border-indigo-200 bg-indigo-50/40 mx-2 mt-4">
          <p className="text-[10px] uppercase tracking-wide font-semibold text-indigo-800 mb-2">
            Enterprise Search · one Serverless project
          </p>
          <div className="flex flex-wrap gap-2">
            {arch.experience.map((item) => (
              <span
                key={item}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-indigo-100 text-indigo-900"
              >
                {item}
              </span>
            ))}
          </div>
        </NodeCard>
      </div>

      <div className="lg:hidden p-4 space-y-3">
        {[
          { title: 'Sources', items: arch.inputs.map((i) => `${i.label} — ${i.detail}`) },
          { title: arch.controlPlane.label, items: [arch.controlPlane.detail] },
          {
            title: arch.federation.label,
            items: arch.federation.routes.map((r) => `${r.label}: ${r.share}`),
          },
          {
            title: 'Search tiers',
            items: arch.storage.map((s) => `${s.label}: ${s.detail}`),
          },
        ].map((block) => (
          <NodeCard key={block.title}>
            <p className="text-xs font-semibold text-elastic-dark">{block.title}</p>
            <ul className="mt-2 space-y-1">
              {block.items.map((line) => (
                <li key={line} className="text-[11px] text-elastic-gray leading-relaxed flex gap-2">
                  <ArrowRight className="w-3 h-3 shrink-0 mt-0.5 text-indigo-400" />
                  {line}
                </li>
              ))}
            </ul>
          </NodeCard>
        ))}
      </div>
    </section>
  );
}

export function FederatedFutureDashboard() {
  return (
    <div className="space-y-6">
      <ModuleHeader
        title="Serverless Search & federated blob sources"
        subtitle="Enterprise Search on Elastic Cloud Serverless — federate S3, GCS, and Azure prefixes for cheap long-retention corpora. Not a replacement for your observability or security platforms."
        badges={[{ label: 'Search · future', tone: 'future' }]}
      />

      <FederatedArchitectureDiagram />

      <div className="grid sm:grid-cols-2 gap-3">
        {FEDERATED_SEARCH_USE_CASES.map((item) => (
          <div key={item.title} className="p-4 rounded-xl border border-gray-200 bg-white">
            <h3 className="text-sm font-semibold text-elastic-dark">{item.title}</h3>
            <p className="text-xs text-elastic-gray mt-2 leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl border border-gray-200 bg-white">
          <h3 className="text-sm font-semibold text-elastic-dark">Why Search + federation</h3>
          <ul className="mt-3 space-y-2 text-xs text-elastic-gray">
            <li className="flex gap-2">
              <span className="text-success font-bold">+</span>
              Query blob archives in place — no second full copy into a sized search cluster.
            </li>
            <li className="flex gap-2">
              <span className="text-success font-bold">+</span>
              Managed Search project: semantic retrieval, connectors, and APIs without shard planning on cold data.
            </li>
            <li className="flex gap-2">
              <span className="text-success font-bold">+</span>
              Complements existing telemetry and security tooling — this tab is archive & knowledge search only.
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-xl border border-dashed border-violet-300 bg-violet-50/30">
          <h3 className="text-sm font-semibold text-elastic-dark">Recommended sequence</h3>
          <ol className="mt-3 space-y-2 text-xs text-elastic-gray list-decimal pl-4">
            <li>Pilot LogsDB + best_compression on hosted log indices (~30% disk win on today&apos;s tab).</li>
            <li>Identify blob prefixes already used for exports, KB snapshots, or compliance bundles.</li>
            <li>Stand up a Search Serverless project; register federated data sources and validate ES|QL + Search UI latency.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default FederatedFutureDashboard;
