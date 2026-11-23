import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveGet, detectPlatform, cleanParam } from '../src/lib/storeLinks.js';

const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
const IPHONE_TIKTOK = IPHONE + ' musical_ly_36.0 BytedanceWebview/d8a21c6';
const IPHONE_INSTAGRAM = IPHONE + ' Instagram 350.0.0.0 (iPhone15,2; iOS 18_0; en_US)';
const ANDROID = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
const ANDROID_INSTAGRAM = ANDROID + ' Instagram 350.0.0.0 Android';
const MAC = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const stores = {
  ios_url: 'https://apps.apple.com/us/app/tree-identifier-id/id6752256800',
  android_url: 'https://play.google.com/store/apps/details?id=com.example.app',
  apple_provider_token: '123456',
};

test('platform detection, including TikTok / Instagram in-app browsers and iPadOS', () => {
  assert.equal(detectPlatform(IPHONE_TIKTOK), 'ios');
  assert.equal(detectPlatform(IPHONE_INSTAGRAM), 'ios');
  assert.equal(detectPlatform(ANDROID_INSTAGRAM), 'android');
  assert.equal(detectPlatform(MAC, 0), 'desktop');
  assert.equal(detectPlatform(MAC, 5), 'ios');
});

test('iPhone → App Store with pt and ct=<series>_<network>', () => {
  const r = resolveGet({ search: '?s=bio&p=tiktok', userAgent: IPHONE_TIKTOK, stores });
  const u = new URL(r.url);
  assert.equal(u.origin + u.pathname, stores.ios_url);
  assert.equal(u.searchParams.get('pt'), '123456');
  assert.equal(u.searchParams.get('ct'), 'bio_tiktok');
});

test('Android → Google Play with encoded install referrer', () => {
  const r = resolveGet({ search: '?s=plant-er&p=instagram', userAgent: ANDROID_INSTAGRAM, stores });
  assert.ok(r.url.startsWith('https://play.google.com/store/apps/details?id=com.example.app&referrer='));
  assert.ok(r.url.endsWith('referrer=utm_source%3Dinstagram%26utm_medium%3Dorganic%26utm_campaign%3Dplant-er'), r.url);
});

test('desktop → fallback page (no redirect)', () => {
  assert.equal(resolveGet({ search: '?s=bio&p=youtube', userAgent: MAC, stores }).url, null);
});

test('to= forces the store chosen on a badge', () => {
  assert.ok(resolveGet({ search: '?to=android', userAgent: IPHONE, stores }).url.startsWith('https://play.google.com/'));
  assert.ok(resolveGet({ search: '?to=ios', userAgent: MAC, stores }).url.startsWith('https://apps.apple.com/'));
});

test('missing provider token → no pt, ct kept; missing Play link → fallback page', () => {
  const r = resolveGet({ search: '?s=bio&p=tiktok', userAgent: IPHONE, stores: { ...stores, apple_provider_token: '[À CONFIRMER]' } });
  assert.equal(new URL(r.url).searchParams.has('pt'), false);
  assert.equal(new URL(r.url).searchParams.get('ct'), 'bio_tiktok');
  assert.equal(resolveGet({ search: '', userAgent: ANDROID, stores: { ...stores, android_url: '[À CONFIRMER]' } }).url, null);
});

test('params are sanitized and defaulted', () => {
  assert.equal(cleanParam('TikTok<script>', 'x'), 'tiktokscript');
  const r = resolveGet({ search: '', userAgent: IPHONE, stores });
  assert.equal(new URL(r.url).searchParams.get('ct'), 'direct_direct');
});

// Web payment (Premium): official store badges must always point to the stores;
// payment goes through our own buttons, and only public Payment Link URLs are stored.
import fsP from 'node:fs';
test('premium: no Stripe secret in content, payment links are https Stripe URLs when set', () => {
  const raw = fsP.readFileSync('content/site.json', 'utf8');
  assert.ok(!/\b(sk|rk)_(live|test)_/.test(raw), 'Stripe secret key found in content/site.json');
  const site = JSON.parse(raw);
  for (const p of site.premium.plans) {
    if (p.stripe_payment_link.includes('[À CONFIRMER]')) continue;
    assert.match(p.stripe_payment_link, /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com)\//);
  }
});
test('premium: store badges in the build never link to the payment page', { skip: !fsP.existsSync('dist/index.html') && 'build first' }, () => {
  for (const f of ['dist/index.html', 'dist/premium/thanks/index.html']) {
    const html = fsP.readFileSync(f, 'utf8');
    for (const m of html.matchAll(/<a [^>]*class="badge-link[^"]*"[^>]*>/g)) assert.ok(!m[0].includes('/premium'), `${f}: ${m[0]}`);
  }
});
