export async function fetchHealth() {
  const res = await fetch('/api/health', { cache: 'no-store' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { ok: false, connected: false, ...data };
  }
  return data;
}

export function kibanaDiscoverUrl(kibanaUrl, esql) {
  if (!kibanaUrl) return null;
  const base = kibanaUrl.replace(/\/$/, '');
  const q = encodeURIComponent(esql);
  return `${base}/app/discover#/?_a=(query:(language:esql,query:'${q}'))`;
}
