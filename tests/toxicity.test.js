// Acceptance: an entry without a source or without verified_at NEVER appears in the game.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { quizCards, isVerified, isPlayable, correctAnswer } from '../src/lib/toxicity.js';

const base = {
  species_scientific: 'Testus plantus', common_name: 'Test plant',
  toxic_cats: 'toxic', toxic_dogs: 'non_toxic', toxic_children: 'unknown', note: '',
  source_url: 'https://example.org/source', verified_by: 'Claire', verified_at: '2026-11-20',
};

test('verified entry is kept', () => {
  assert.equal(quizCards([base]).length, 1);
});

for (const [label, patch] of [
  ['empty source_url', { source_url: '' }],
  ['missing source_url', { source_url: undefined }],
  ['source_url not a URL', { source_url: 'aspca' }],
  ['source_url [À CONFIRMER]', { source_url: '[À CONFIRMER]' }],
  ['empty verified_at', { verified_at: '' }],
  ['missing verified_at', { verified_at: undefined }],
  ['null verified_at', { verified_at: null }],
  ['verified_at not a date', { verified_at: 'yes' }],
  ['verified_at [À CONFIRMER]', { verified_at: '[À CONFIRMER]' }],
]) {
  test(`entry with ${label} never reaches the game`, () => {
    const e = { ...base, ...patch };
    assert.equal(isVerified(e), false);
    assert.deepEqual(quizCards([e]), []);
  });
}

test('unknown cat or dog status is not playable (no answer can be given)', () => {
  assert.equal(isPlayable({ ...base, toxic_cats: 'unknown' }), false);
  assert.equal(isPlayable({ ...base, toxic_dogs: 'unknown' }), false);
});

test('correct answer: toxic if toxic or mild for cats or dogs', () => {
  assert.equal(correctAnswer({ toxic_cats: 'toxic', toxic_dogs: 'non_toxic' }), 'toxic');
  assert.equal(correctAnswer({ toxic_cats: 'non_toxic', toxic_dogs: 'mild' }), 'toxic');
  assert.equal(correctAnswer({ toxic_cats: 'non_toxic', toxic_dogs: 'non_toxic' }), 'not_toxic');
});

test('real /content/toxicity.json: only verified entries are playable, all fields valid', () => {
  const data = JSON.parse(fs.readFileSync(new URL('../content/toxicity.json', import.meta.url)));
  const statuses = ['toxic', 'non_toxic', 'mild', 'unknown'];
  for (const e of data) {
    for (const k of ['toxic_cats', 'toxic_dogs', 'toxic_children']) assert.ok(statuses.includes(e[k]), `${e.common_name}.${k}`);
    for (const k of ['species_scientific', 'common_name', 'note', 'source_url', 'verified_by', 'verified_at']) assert.ok(k in e, `${e.common_name} missing ${k}`);
  }
  for (const c of quizCards(data)) assert.ok(isVerified(data.find((e) => e.species_scientific === c.species_scientific)));
});

test('the built page contains no unverified entry', { skip: !fs.existsSync('dist/index.html') && 'run npm run build first' }, () => {
  const html = fs.readFileSync('dist/index.html', 'utf8');
  const data = JSON.parse(fs.readFileSync('content/toxicity.json', 'utf8'));
  for (const e of data.filter((x) => !isVerified(x))) {
    assert.ok(!html.includes(e.species_scientific), `${e.species_scientific} is unverified but present in dist/index.html`);
  }
});
