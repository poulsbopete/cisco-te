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
  title: 'Elastic Cloud Serverless Search · federated blob corpora',
  subtitle:
    'Enterprise Search on a managed Serverless project — register inexpensive object storage as federated data sources and query archives without standing up search clusters on blob.',
  badge: 'Enterprise Search · roadmap',
  compareNote:
    'Today: LogsDB on hosted log indices. Tomorrow: Search Serverless + federated S3/GCS/Azure for knowledge bases, exports, and compliance corpora — observability stays on your existing stack.',
  inputs: [
    { id: 'managed', label: 'Managed search indices', detail: 'Product docs · runbooks · support articles', rate: 'Sub-second UX' },
    { id: 'connectors', label: 'Content connectors', detail: 'SharePoint · web crawl · API sync', rate: 'Incremental ingest' },
    { id: 'archive', label: 'Blob archives', detail: 'S3 · GCS · Azure Blob · historical JSON/Parquet exports', rate: 'Federated read' },
  ],
  controlPlane: {
    label: 'Serverless Search project',
    detail: 'Elastic-operated · no search cluster sizing · project API keys & RBAC',
    status: 'Healthy',
  },
  federation: {
    label: 'Federated data sources',
    detail: 'Map bucket prefixes · schema-on-read · same ES|QL & Search UI',
    routes: [
      { id: 'hot', label: 'Hot search corpus', share: 'Fresh KB · in-app & portal search', accent: 'emerald' },
      { id: 'fed', label: 'Federated buckets', share: 'Cold archives · cents/GB-month blob', accent: 'emerald' },
      { id: 'lifecycle', label: 'Tier to blob', share: 'Export or snapshot → federate (no re-copy)', accent: 'gray' },
    ],
  },
  storage: [
    {
      id: 'active',
      label: 'Managed search tier',
      detail: 'Lexical + semantic · ELSER · autocomplete',
      metrics: 'Interactive search · ms–s class',
      status: 'Good',
    },
    {
      id: 'object',
      label: 'Federated object tier',
      detail: 'Query blob in place · long-retention corpora',
      metrics: 'Archive search · blob economics',
      status: 'Good',
    },
  ],
  destinations: [
    { id: 'unified', label: 'Unified search', detail: 'One query across managed indices and federated prefixes' },
    { id: 'admin', label: 'Easy administration', detail: 'Register data sources in UI — no shard math on cold storage' },
  ],
  experience: [
    'Enterprise Search UI',
    'ES|QL · Search applications',
    'Semantic · ELSER',
    'Connectors & APIs',
  ],
};

export const FEDERATED_SEARCH_USE_CASES = [
  {
    title: 'Knowledge & support',
    body: 'Search product documentation, release notes, and support macros — hot tier for agents, federated blob for years of archived tickets and PDFs.',
  },
  {
    title: 'Compliance & audit',
    body: 'Federate immutable exports in object storage for e-discovery and policy review without reloading petabytes into RAM-backed indices.',
  },
  {
    title: 'Data platform handoff',
    body: 'Analytics pipelines land curated JSON/Parquet in S3; Search Serverless federates those prefixes for self-serve lookup and ES|QL exploration.',
  },
  {
    title: 'Hybrid retention',
    body: 'Keep recent corpus on managed Search for speed; tier aged content to blob and federate — same search bar, lower storage spend.',
  },
];

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
