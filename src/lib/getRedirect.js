// Entry inlined into /get at build time (no extra request before the redirect).
// Uses resolveGet (storeLinks.js) and makeTracker (track.js), concatenated before it.
import { resolveGet } from './storeLinks.js';
import { makeTracker } from './track.js';

const stores = JSON.parse(document.getElementById('get-stores').textContent);
const track = makeTracker(JSON.parse(document.getElementById('analytics-config')?.textContent || '{}'));
const r = resolveGet({ search: location.search, userAgent: navigator.userAgent, maxTouchPoints: navigator.maxTouchPoints || 0, stores });

if (r.url) {
  track('store_click', { os: r.platform, series: r.series, network: r.network, from: 'get' }); // beacon: non-blocking
  location.replace(r.url);
} else {
  document.querySelector('[data-get-redirecting]').hidden = true;
  document.querySelector('[data-get-fallback]').hidden = false;
  document.querySelectorAll('a[data-get-link]').forEach((a) => {
    const u = new URL(a.getAttribute('href'), location.href);
    u.searchParams.set('s', r.series);
    u.searchParams.set('p', r.network);
    a.setAttribute('href', u.pathname + u.search);
  });
  document.documentElement.dataset.getPlatform = r.platform;
}
