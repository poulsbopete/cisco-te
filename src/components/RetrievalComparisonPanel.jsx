import { GitMerge, Sparkles, Zap } from 'lucide-react';
import {
  ELSER_PROFILE,
  ELSER_RESULTS,
  HYBRID_RRF_GUIDANCE,
  JINA_PROFILE,
  JINA_RESULTS,
  RETRIEVAL_KB_LABEL,
  RETRIEVAL_METRICS,
  RETRIEVAL_SAMPLE_QUERY,
} from '../utils/retrieval-comparison';

function ModelCard({ profile, accent }) {
  return (
    <div className={`rounded-xl border p-4 ${accent}`}>
      <p className="text-[10px] uppercase tracking-wide font-bold text-elastic-gray">{profile.mode}</p>
      <h4 className="text-sm font-semibold text-elastic-dark mt-1">{profile.name}</h4>
      <p className="text-xs text-elastic-gray mt-2 leading-relaxed">{profile.blurb}</p>
      <p className="text-[11px] text-elastic-dark mt-3">
        <span className="font-semibold">Best for:</span> {profile.bestFor}
      </p>
      {profile.overtakingNote && (
        <p className="text-[11px] text-violet-900 mt-3 p-2.5 rounded-lg bg-violet-50 border border-violet-100 leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 inline mr-1 text-violet-600 -mt-0.5" />
          {profile.overtakingNote}
        </p>
      )}
    </div>
  );
}

function ResultsTable({ title, rows, scoreTone }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <p className="text-xs font-semibold text-elastic-dark px-3 py-2 border-b border-gray-100 bg-gray-50/80">
        {title}
      </p>
      <table className="w-full text-left text-[11px]">
        <thead>
          <tr className="text-elastic-gray border-b border-gray-100">
            <th className="px-3 py-1.5 font-medium w-8">#</th>
            <th className="px-3 py-1.5 font-medium">Document</th>
            <th className="px-3 py-1.5 font-medium text-right w-14">Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.rank} className="border-b border-gray-50 last:border-0">
              <td className="px-3 py-2 text-elastic-gray">{row.rank}</td>
              <td className="px-3 py-2 text-elastic-dark">{row.title}</td>
              <td className={`px-3 py-2 text-right font-semibold tabular-nums ${scoreTone}`}>{row.score}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RetrievalComparisonPanel() {
  const m = RETRIEVAL_METRICS;

  return (
    <section className="rounded-xl border border-indigo-200/80 bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] uppercase tracking-wide font-bold text-indigo-800">Semantic retrieval</p>
          <h3 className="text-sm font-semibold text-elastic-dark">Jina vs ELSER — retrieval comparison</h3>
          <p className="text-[11px] text-elastic-gray mt-0.5">
            Index: <code className="text-indigo-900 bg-indigo-50 px-1 rounded">{RETRIEVAL_KB_LABEL}</code>
          </p>
        </div>
        <span className="text-[10px] font-medium text-violet-800 bg-violet-100 border border-violet-200 rounded-full px-2.5 py-1">
          NL workloads → Jina-class overtaking sparse ELSER
        </span>
      </div>

      <div className="p-4 space-y-4">
        <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
          <p className="text-[10px] uppercase text-elastic-gray font-medium">Sample query</p>
          <p className="text-sm text-elastic-dark mt-0.5">&ldquo;{RETRIEVAL_SAMPLE_QUERY}&rdquo;</p>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <ModelCard
            profile={ELSER_PROFILE}
            accent="border-amber-200/70 bg-amber-50/30"
          />
          <ModelCard
            profile={JINA_PROFILE}
            accent="border-indigo-200/70 bg-indigo-50/30"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <MetricPill label="Top match agree" value={m.topMatchAgree ? 'Yes' : 'No'} />
          <MetricPill label="Speed winner" value={m.speedWinner} highlight />
          <MetricPill label="ELSER latency" value={`${m.elserMs}ms`} />
          <MetricPill label="Jina latency" value={`${m.jinaMs}ms`} sub={`Δ ${m.latencyDeltaMs}ms`} />
        </div>
        <p className="text-[11px] text-elastic-gray">{m.rankNote}</p>

        <div className="grid md:grid-cols-2 gap-3">
          <ResultsTable title="ELSER results (sparse)" rows={ELSER_RESULTS} scoreTone="text-amber-800" />
          <ResultsTable title="Jina results (dense)" rows={JINA_RESULTS} scoreTone="text-indigo-700" />
        </div>

        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/40 p-4">
          <h4 className="text-sm font-semibold text-elastic-dark flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-emerald-700" />
            {HYBRID_RRF_GUIDANCE.title}
          </h4>
          <ul className="mt-2 space-y-1.5 text-xs text-elastic-gray list-disc pl-4">
            {HYBRID_RRF_GUIDANCE.bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p className="text-[11px] text-emerald-900 mt-3 flex gap-2 leading-relaxed">
            <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            {HYBRID_RRF_GUIDANCE.serverlessAngle}
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricPill({ label, value, sub, highlight = false }) {
  return (
    <div className={`rounded-lg border px-2.5 py-2 ${highlight ? 'border-success/40 bg-success/5' : 'border-gray-200 bg-white'}`}>
      <p className="text-[9px] uppercase tracking-wide text-elastic-gray">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${highlight ? 'text-success' : 'text-elastic-dark'}`}>{value}</p>
      {sub && <p className="text-[10px] text-elastic-gray">{sub}</p>}
    </div>
  );
}

export default RetrievalComparisonPanel;
