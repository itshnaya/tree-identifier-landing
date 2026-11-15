// Store link builder used by /get (browser) and by the tests (Node).
// Pure functions only: no DOM access here.
import { isTBC } from './tbc.js';

/** Keeps campaign values short and safe: lowercase letters, digits, - and _. */
export function cleanParam(value, fallback) {
  const v = String(value ?? '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
  return v || fallback;
}

/** "ios" | "android" | "desktop" from a user agent (+ optional touch hint for iPadOS). */
export function detectPlatform(userAgent = '', maxTouchPoints = 0) {
  const ua = String(userAgent);
  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipad|ipod/i.test(ua)) return 'ios';
  // iPadOS 13+ reports itself as a Mac; a Mac with a touch screen is an iPad.
  if (/macintosh/i.test(ua) && maxTouchPoints > 1) return 'ios';
  return 'desktop';
}

/** App Store link with Apple campaign parameters pt (provider token) and ct (campaign). */
export function appStoreUrl(iosUrl, providerToken, series, network) {
  if (isTBC(iosUrl)) return null;
  const u = new URL(iosUrl);
  if (!isTBC(providerToken)) u.searchParams.set('pt', providerToken);
  u.searchParams.set('ct', `${series}_${network}`);
  u.searchParams.set('mt', '8');
  return u.toString();
}

/** Google Play link with an install referrer carrying UTM parameters. */
export function googlePlayUrl(androidUrl, series, network) {
  if (isTBC(androidUrl)) return null;
  const u = new URL(androidUrl);
  const referrer = `utm_source=${network}&utm_medium=organic&utm_campaign=${series}`;
  // URLSearchParams encodes "=" as %3D and "&" as %26, as Google Play expects.
  u.searchParams.set('referrer', referrer);
  return u.toString();
}

/**
 * Decides where /get sends the visitor.
 * @returns {{platform: string, series: string, network: string, url: string|null}}
 * url === null means: show the fallback page (badges + QR code).
 */
export function resolveGet({ search = '', userAgent = '', maxTouchPoints = 0, stores }) {
  const q = new URLSearchParams(search);
  const series = cleanParam(q.get('s'), 'direct');
  const network = cleanParam(q.get('p'), 'direct');
  const forced = q.get('to');
  const platform = forced === 'ios' || forced === 'android' ? forced : detectPlatform(userAgent, maxTouchPoints);
  let url = null;
  if (platform === 'ios') url = appStoreUrl(stores.ios_url, stores.apple_provider_token, series, network);
  if (platform === 'android') url = googlePlayUrl(stores.android_url, series, network);
  return { platform, series, network, url };
}
