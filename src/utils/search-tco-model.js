/**
 * Illustrative TCO workshop model — open-source self-managed Elasticsearch
 * vs Elastic Cloud Serverless Search + federated blob. Not a quote; tune in workshop.
 */

export const TCO_MODEL_DISCLAIMER =
  'Illustrative annual model for workshop discussion. Replace rates with your cloud invoices, FTE loading, and Elastic subscription estimate before decisions.';

/** Fully loaded platform/SRE cost per FTE (USD/year). */
export const DEFAULT_FTE_LOADED_USD = 285_000;

export const DEFAULT_TCO_INPUTS = {
  hotCorpusTb: 30,
  federatedArchivePb: 1.2,
  opsFte: 2.5,
  /** Share of archive you today keep search-addressable on self-managed ES (vs blob-only). */
  archiveIndexedFraction: 0.65,
};

export const OSS_VS_SERVERLESS_ADVANTAGES = [
  {
    title: 'No cluster topology on cold data',
    body: 'Self-managed Search means sizing data nodes, masters, and ILM for every PB you want queryable. Federated blob queries archives in place — you stop paying RAM and replica tax on compliance-age corpora.',
  },
  {
    title: 'Ops FTE shifts to outcomes',
    body: 'Open source Elastic still needs upgrades, shard rebalancing, certificate rotation, and incident fire drills. Serverless absorbs patch cadence and elasticity; your team focuses on connectors, relevance, and data sources.',
  },
  {
    title: 'Predictable Search SKU vs hidden infra',
    body: 'OSS bills scatter across EC2, EBS, cross-AZ traffic, backups, and over-provisioned headroom. Serverless Search + federation maps spend to managed hot corpus plus low blob $/GB — easier FinOps for the commercial line.',
  },
  {
    title: 'Faster path to semantic & connectors',
    body: 'ELSER, Search applications, and connector framework on Serverless avoid running inference and ingest tiers yourself on the same cluster that already struggles with storage growth.',
  },
];

/** Annual USD — self-managed open source stack (Search-focused). */
export function calculateOpenSourceSearchTco({
  hotCorpusTb,
  federatedArchivePb,
  opsFte,
  archiveIndexedFraction,
}) {
  const hotPerTb = 24_000;
  const hotReplicaOverhead = 1.18;
  const archiveIndexedPerPb = 92_000;
  const blobPassivePerPb = 3_600;
  const platformOverheadPct = 0.12;
  const overprovisionPct = 0.22;

  const hotInfra = hotCorpusTb * hotPerTb * hotReplicaOverhead;
  const archiveSearchable = federatedArchivePb * archiveIndexedFraction * archiveIndexedPerPb;
  const archiveBlobOnly = federatedArchivePb * (1 - archiveIndexedFraction) * blobPassivePerPb;
  const ops = opsFte * DEFAULT_FTE_LOADED_USD;
  const subtotal = hotInfra + archiveSearchable + archiveBlobOnly + ops;
  const platform = subtotal * platformOverheadPct;
  const waste = (hotInfra + archiveSearchable) * overprovisionPct;
  const total = subtotal + platform + waste;

  return {
    total,
    lines: [
      { id: 'hot', label: 'Hot Search cluster (compute + replicas)', value: hotInfra },
      { id: 'archive', label: 'Self-managed searchable archive tiers', value: archiveSearchable },
      { id: 'blob', label: 'Blob storage (passive, still need ES for query)', value: archiveBlobOnly },
      { id: 'ops', label: 'Platform engineering & SRE (loaded FTE)', value: ops },
      { id: 'platform', label: 'Monitoring, backups, tooling', value: platform },
      { id: 'waste', label: 'Typical over-provision & idle headroom', value: waste },
    ],
  };
}

/** Annual USD — Serverless Search + federated data sources. */
export function calculateServerlessSearchTco({
  hotCorpusTb,
  federatedArchivePb,
  opsFte,
}) {
  const hotPerTb = 13_500;
  const federatedPerPb = 38_000;
  const opsReduction = 0.58;

  const hotManaged = hotCorpusTb * hotPerTb;
  const federated = federatedArchivePb * federatedPerPb;
  const ops = opsFte * DEFAULT_FTE_LOADED_USD * (1 - opsReduction);
  const total = hotManaged + federated + ops;

  return {
    total,
    lines: [
      { id: 'hot', label: 'Serverless Search · managed hot corpus', value: hotManaged },
      { id: 'federated', label: 'Federated blob prefixes (storage + query)', value: federated },
      { id: 'ops', label: 'Reduced ES operations FTE', value: ops },
    ],
  };
}

export function compareSearchTco(inputs = DEFAULT_TCO_INPUTS) {
  const oss = calculateOpenSourceSearchTco(inputs);
  const serverless = calculateServerlessSearchTco(inputs);
  const savingsUsd = oss.total - serverless.total;
  const savingsPct = oss.total > 0 ? (savingsUsd / oss.total) * 100 : 0;

  return {
    oss,
    serverless,
    savingsUsd,
    savingsPct,
    inputs,
  };
}

export function formatUsdCompact(value) {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${Math.round(value / 1_000)}K`;
  return `$${Math.round(value)}`;
}

export function formatUsdFull(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}
