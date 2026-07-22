/** Workshop data for sparse (ELSER-class) vs dense (Jina-class) retrieval — vendor-neutral KB label. */

export const RETRIEVAL_KB_LABEL = 'enterprise-network-kb';

export const RETRIEVAL_SAMPLE_QUERY =
  'How to recover an access point that went offline?';

export const ELSER_PROFILE = {
  name: 'ELSER v2',
  mode: 'Sparse · Elasticsearch inference',
  blurb:
    'Native inference endpoint in Elasticsearch — strong on exact networking terms (BGP, STP, IOS-XE). No external API hop; sub-100ms class on hot indices.',
  bestFor: 'Keyword-heavy support queries · SIEM-style correlation · air-gapped inference',
};

export const JINA_PROFILE = {
  name: 'Jina',
  mode: 'Dense · embeddings + reranker API',
  blurb:
    'Paraphrase-friendly retrieval (jina-embeddings + reranker). Multilingual, API-first, model-agnostic — intent wins when users do not match manual keywords.',
  bestFor: 'Field chat · voice-to-text · fuzzy natural-language questions',
  overtakingNote:
    'Dense + rerank stacks like Jina are quickly overtaking sparse ELSER on NL-heavy corpora — plan Serverless Search with external inference/rerank while ELSER covers legacy exact-term paths during transition.',
};

export const RETRIEVAL_METRICS = {
  topMatchAgree: false,
  speedWinner: 'ELSER',
  elserMs: 107,
  jinaMs: 845,
  latencyDeltaMs: 738,
  rankNote: 'Minor rank differences — Jina better for paraphrases, ELSER for exact terms.',
};

export const ELSER_RESULTS = [
  { rank: 1, title: 'BGP Neighbor Down — IOS-XE Troubleshooting', score: 99 },
  { rank: 2, title: 'Cloud AP Offline Recovery', score: 99 },
];

export const JINA_RESULTS = [
  { rank: 1, title: 'Cloud AP Offline Recovery', score: 86 },
  { rank: 2, title: 'SD-WAN Tunnel Down — vManage Recovery', score: 10 },
];

export const HYBRID_RRF_GUIDANCE = {
  title: 'Hybrid: rank-over-rank fusion (RRF)',
  bullets: [
    'When ELSER and Jina agree on the top doc → high-confidence answer; skip extra rerank.',
    'When they diverge → fuse with RRF and boost docs that appear in both lists.',
    'Production pattern: ELSER (or BM25) in Elasticsearch · Jina rerank top-k (e.g. 20) · federate blob hits the same pipeline.',
  ],
  serverlessAngle:
    'On Serverless Search, pair managed lexical/sparse with Jina-class rerank — lower ops than self-hosted ELSER GPU tiers while NL quality catches up to what sparse alone cannot deliver.',
};
