// Privacy-friendly, cookieless analytics (Plausible Events API by default).
// Disabled until /content/site.json → analytics.enabled = true and domain set.
// sendBeacon never delays navigation.
export function makeTracker(cfg) {
  const ok = cfg && cfg.enabled && cfg.domain && !String(cfg.domain).includes('[À CONFIRMER]');
  return function track(name, props = {}) {
    if (!ok) return false;
    try {
      const body = JSON.stringify({ name, url: location.href, domain: cfg.domain, referrer: document.referrer || null, props });
      const endpoint = `${cfg.api_host.replace(/\/$/, '')}/api/event`;
      if (navigator.sendBeacon) return navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain' }));
      fetch(endpoint, { method: 'POST', body, keepalive: true, mode: 'no-cors' });
      return true;
    } catch {
      return false;
    }
  };
}
