# Elastic Observability · Storage & Capacity Demo

Public Vercel workshop site for **LogsDB**, **best_compression**, **ILM / frozen tiers**, and the **Elastic Cloud Serverless + federated data sources** roadmap. The UI is vendor-neutral (no customer logos or names).

Built in the same shape as the PayPal observability platform demo (**reference:** `/Users/psimkins/opt/paypal_2026_o11y_platform`): **Vite + React**, optional **Vercel serverless** `/api/health` against Elastic Cloud.

### vs PayPal demo (`paypal_2026_o11y_platform`)

| PayPal module | This repo |
|---------------|-----------|
| Observability RFP · $/PB · Streams · `NextGenServerlessDiagram` | **LogsDB today** + **Capacity & ILM** (storage-first workshop) |
| Business Telemetry · live OTel · A2A · workflows | Not included (neutral public site) |
| Enterprise Search · ELSER chat | Not included |
| Elastic Security · SIEM | Not included |
| Multi-backend `api/demo/*` · ES\|QL proxy | Minimal `api/health` only (extend by copying `api/` from PayPal) |

## Modules

| Tab | Content |
|-----|---------|
| **LogsDB today** | Index template snippet, ~30% storage savings model, CPU trade-offs |
| **Capacity & ILM** | Auto-scale at ~85% disk, shard limits, tier strategy |
| **Serverless future** | Federated data sources architecture diagram |

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). API requests proxy to `server/dev-api.mjs` on port 3001.

## Deploy on Vercel

1. Import [github.com/poulsbopete/cisco-te](https://github.com/poulsbopete/cisco-te).
2. Framework preset: **Vite** (or use included `vercel.json`).
3. Optional env vars for live health badge:
   - `ES_URL`
   - `ES_API_KEY`
   - `KIBANA_URL`

Without credentials the site runs fully on illustrative workshop data.

## Internal context

Repo supports commercial observability capacity conversations (hosted cluster storage pressure, LogsDB pilot, Serverless federation). Keep customer-specific naming out of the public UI.

## License

Demo content for Elastic field workshops. Elasticsearch and Kibana are trademarks of Elasticsearch B.V.
