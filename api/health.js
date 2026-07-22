import { getBackendConfig, probeCluster } from './_lib/elastic.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const config = getBackendConfig();
  const backend = await probeCluster();

  if (!config.ok) {
    return res.status(503).json({
      ok: false,
      connected: false,
      error: config.error,
      hint: 'Set ES_URL and ES_API_KEY in Vercel project settings for live health',
      backend,
    });
  }

  if (!backend.connected) {
    return res.status(502).json({
      ok: false,
      connected: false,
      error: backend.error,
      backend,
    });
  }

  return res.status(200).json({
    ok: true,
    connected: true,
    cluster: backend.cluster,
    kibanaUrl: backend.kibanaUrl,
    esUrl: backend.esUrl,
    backend,
  });
}
