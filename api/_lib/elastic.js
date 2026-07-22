export function isValidElasticCloudUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  return /^https:\/\/[a-z0-9.-]+\.(es|kb)\.[a-z0-9-]+\.(aws|gcp|azure)\.elastic\.cloud\/?$/i.test(trimmed);
}

export function getBackendConfig() {
  const esUrl = process.env.ES_URL?.trim()?.replace(/\/$/, '');
  const apiKey = process.env.ES_API_KEY?.trim();
  const kibanaUrl = process.env.KIBANA_URL?.trim()?.replace(/\/$/, '')
    || (esUrl ? esUrl.replace('.es.', '.kb.') : null);

  if (!esUrl || !apiKey) {
    return { ok: false, error: 'Missing ES_URL and ES_API_KEY' };
  }
  if (!isValidElasticCloudUrl(esUrl)) {
    return { ok: false, error: 'ES_URL must be a valid Elastic Cloud HTTPS endpoint' };
  }

  return { ok: true, esUrl, apiKey, kibanaUrl };
}

export async function probeCluster() {
  const config = getBackendConfig();
  if (!config.ok) {
    return { connected: false, error: config.error };
  }

  try {
    const res = await fetch(`${config.esUrl}/`, {
      headers: { Authorization: `ApiKey ${config.apiKey}` },
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { connected: false, error: body?.error?.reason || res.statusText };
    }
    return {
      connected: true,
      cluster: body.cluster_name || 'elasticsearch',
      kibanaUrl: config.kibanaUrl,
      esUrl: config.esUrl,
    };
  } catch (err) {
    return { connected: false, error: err.message || 'Unreachable' };
  }
}
