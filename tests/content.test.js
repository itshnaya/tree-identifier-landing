// Content rules: every [À CONFIRMER] is listed in the README; every English text is in copy.md;
// no forbidden words; "safe" only where allowed.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { findTBC, proposalOf, TBC } from '../src/lib/tbc.js';

const read = (p) => fs.readFileSync(p, 'utf8');
const json = (p) => JSON.parse(read(p));
const files = ['site', 'cast', 'series', 'toxicity'];
const content = Object.fromEntries(files.map((f) => [f, json(`content/${f}.json`)]));

test('every [À CONFIRMER] in /content is listed in README.md', () => {
  const readme = read('README.md');
  const missing = [];
  for (const f of files) for (const p of findTBC(content[f])) {
    const key = `${f}.json → ${p}`;
    if (!readme.includes(key)) missing.push(key);
  }
  assert.deepEqual(missing, []);
});

function strings(obj, out = []) {
  if (typeof obj === 'string') out.push(obj);
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((v) => strings(v, out));
  return out;
}

test('every page text is in content/copy.md (English + French)', () => {
  const copy = read('content/copy.md');
  const skip = /^(https?:|\/|\[À CONFIRMER\]$|#|plausible$|step-\d|monty$|terra$|leaf$|gold$|mint$|iOS$|USD$|0$|[a-z-]+$|\d{4}-)/;
  const texts = [...strings(content.site), ...strings(content.cast), ...strings(content.series)]
    .map((t) => (t.includes(TBC) ? proposalOf(t) : t))
    .filter((t) => t.trim() && !skip.test(t));
  const missing = texts.filter((t) => !copy.includes(t));
  assert.deepEqual(missing, []);
});

test('no invented social proof or forbidden wording in content', () => {
  const all = files.flatMap((f) => strings(content[f])).filter((t) => !t.startsWith('/') && !t.startsWith('http')).join(' | ').toLowerCase();
  for (const w of ['best app', 'love island', 'rating', 'review', 'downloads', 'award', '#1', 'million', 'search for tree identifier', 'stars']) {
    assert.ok(!new RegExp(`(^|\\W)${w.replace(/[#]/g, '\\$&')}(\\W|$)`).test(all), `forbidden: ${w}`);
  }
});

test('"safe" only in the allowed places (cheat sheet title given by the brief, non_toxic status label)', () => {
  const allowed = new Set(['The Pet-Safe Plant Cheat Sheet', 'Not toxic (listed as safe)']);
  const bad = [...strings(content.site), ...strings(content.cast), ...strings(content.series)]
    .filter((t) => !t.startsWith('/') && /\bsafe(ly)?\b/i.test(t) && !allowed.has(t));
  assert.deepEqual(bad, []);
});

test('published build: no [À CONFIRMER] and no proposal is visible', { skip: !fs.existsSync('dist/index.html') && 'run npm run build first' }, () => {
  const html = read('dist/index.html');
  if (html.includes('data-show-tbc="1"')) return; // local SHOW_TBC=1 review build: badges allowed
  assert.ok(!html.includes(TBC), 'dist/index.html (production) contains [À CONFIRMER]');
  for (const f of files) for (const t of strings(content[f])) {
    const prop = proposalOf(t);
    if (prop) assert.ok(!html.includes(prop), `proposal visible in production: ${prop}`);
  }
});
