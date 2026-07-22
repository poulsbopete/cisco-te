/** Scenario constants for capacity & storage narrative (synthetic sizing workshop). */

export const DEFAULT_LOG_VOLUME_PB = 2.4;
export const DEFAULT_DAILY_INGEST_TB = 180;

export const LOGSDB_SAVINGS = {
  conservative: 0.3,
  typical: 0.45,
  aggressive: 0.65,
  label: '30–80% on-disk reduction',
  note: 'Workload-dependent; index sorting increases indexing CPU.',
};

export const INDEX_TEMPLATE_SNIPPET = `PUT _index_template/telemetry-logs
{
  "index_patterns": ["logs-*", "telemetry-*"],
  "template": {
    "settings": {
      "index": {
        "mode": "logsdb",
        "codec": "best_compression",
        "sort.field": ["@timestamp", "service.name"],
        "sort.order": ["desc", "asc"]
      }
    }
  },
  "priority": 500
}`;

export const COMPARISON_MODES = [
  {
    id: 'standard',
    label: 'Standard indices',
    mode: 'standard',
    codec: 'default',
    relativeSize: 1,
    cpuIndex: 1,
  },
  {
    id: 'logsdb',
    label: 'LogsDB + best_compression',
    mode: 'logsdb',
    codec: 'best_compression',
    relativeSize: 0.7,
    cpuIndex: 1.25,
  },
  {
    id: 'logsdb-frozen',
    label: 'LogsDB + ILM to searchable snapshot',
    mode: 'logsdb',
    codec: 'best_compression',
    relativeSize: 0.55,
    cpuIndex: 1.2,
    frozenNote: 'Aged tiers on object storage — lower $/GB, slightly higher query latency on cold data.',
  },
];

export const AUTOSCALE_FACTS = [
  {
    title: 'Storage trigger',
    detail: 'Elastic Cloud auto-scaling often reacts when disk crosses ~85% — late for teams that want headroom before vertical jumps.',
    severity: 'warning',
  },
  {
    title: 'Vertical inflection',
    detail: 'Hosted deployments scale node RAM vertically until ~58 GB per zone, then add data nodes horizontally — each step can multiply hourly cost.',
    severity: 'neutral',
  },
  {
    title: 'Dedicated masters',
    detail: 'At six data nodes, dedicated master nodes are added automatically — another capacity dimension not visible in disk-only policies.',
    severity: 'neutral',
  },
  {
    title: 'Shard & CPU pressure',
    detail: 'Disk metrics alone miss ~1,000 shards/node limits and master CPU credits — clusters can stay yellow while storage policy looks healthy.',
    severity: 'danger',
  },
];

export const FEDERATED_ARCHITECTURE = {
  title: 'Elastic Cloud Serverless · federated observability',
  subtitle:
    'Keep administration on Elastic while long-retention and archive tiers live in inexpensive object storage — query in place without re-sizing hot clusters.',
  badge: 'Roadmap · simplified ops',
  compareNote:
    'Today: optimize hosted footprint with LogsDB and ILM. Tomorrow: same Kibana experience with Serverless control plane + federated data sources.',
  inputs: [
    { id: 'otel', label: 'OpenTelemetry', detail: 'Agents & collectors · high-cardinality logs', rate: 'Multi-TB/day class' },
    { id: 'bulk', label: 'Elastic Agent', detail: 'Beats · Logstash · bulk pipelines', rate: '10k+ eps' },
    { id: 'archive', label: 'Existing archives', detail: 'S3 · GCS · Azure Blob · on-prem object store', rate: 'Federated read' },
  ],
  controlPlane: {
    label: 'Serverless control plane',
    detail: 'Elastic-operated · no data-node sizing · project-scoped RBAC',
    status: 'Healthy',
  },
  federation: {
    label: 'Federated data sources',
    detail: 'Register object-store prefixes · schema-on-read · unified ES|QL',
    routes: [
      { id: 'hot', label: 'Managed hot tier', share: 'Recent telemetry · alerts · SLOs', accent: 'emerald' },
      { id: 'fed', label: 'Federated buckets', share: 'Compliance & research · blob $/GB', accent: 'emerald' },
      { id: 'ilm', label: 'ILM handoff', share: 'Roll from hot → object without re-ingest', accent: 'gray' },
    ],
  },
  storage: [
    {
      id: 'active',
      label: 'Active search tier',
      detail: 'Sub-second triage · dashboards · anomaly detection',
      metrics: 'Hot queries · ≤1s class',
      status: 'Good',
    },
    {
      id: 'object',
      label: 'Object storage tier',
      detail: 'Searchable snapshots · federated prefixes · frozen class',
      metrics: 'Aged data · cents/GB-month',
      status: 'Good',
    },
  ],
  destinations: [
    { id: 'logs', label: 'Logs · metrics · traces', detail: 'Single ES|QL surface across managed + federated data' },
    { id: 'ops', label: 'Operations', detail: 'ILM · index templates · project API keys — no cluster topology meetings' },
  ],
  experience: [
    'Kibana Discover & Lens',
    'ES|QL across tiers',
    'APM & SLOs',
    'Alerting & cases',
  ],
};

export function formatPb(value) {
  return `${value.toFixed(1)} PB`;
}

export function formatUsdMillions(value) {
  if (value >= 1) return `$${value.toFixed(2)}M/yr`;
  return `$${(value * 1000).toFixed(0)}K/yr`;
}

/** Rough hosted storage $ model for workshop (not a quote). */
export function estimateAnnualStorageCost(pbStored, { savingsPct = 0 }) {
  const basePerPbYear = 420_000;
  const effectivePb = pbStored * (1 - savingsPct);
  return effectivePb * basePerPbYear;
}
