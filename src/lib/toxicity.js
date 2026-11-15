// Rules (CLAUDE.md, rule 3): only entries with a source AND a filled verified_at
// are ever shown. Everything here runs at build time; unverified entries never
// reach the browser.
import { isTBC } from './tbc.js';

export const STATUSES = ['toxic', 'non_toxic', 'mild', 'unknown'];

function isHttpUrl(v) {
  if (isTBC(v)) return false;
  try {
    const u = new URL(v);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

function isFilledDate(v) {
  if (isTBC(v)) return false;
  return /^\d{4}-\d{2}-\d{2}/.test(v) && !Number.isNaN(Date.parse(v));
}

/** An entry is verified when it has a valid source URL and a real verified_at date. */
export function isVerified(entry) {
  return Boolean(entry) && isHttpUrl(entry.source_url) && isFilledDate(entry.verified_at);
}

/** An entry is playable when verified and its cat + dog statuses are known. */
export function isPlayable(entry) {
  return (
    isVerified(entry) &&
    ['toxic_cats', 'toxic_dogs', 'toxic_children'].every((k) => STATUSES.includes(entry[k])) &&
    entry.toxic_cats !== 'unknown' &&
    entry.toxic_dogs !== 'unknown'
  );
}

/** The correct quiz answer: "toxic" if harmful (toxic or mild) to cats or dogs. */
export function correctAnswer(entry) {
  const harmful = (s) => s === 'toxic' || s === 'mild';
  return harmful(entry.toxic_cats) || harmful(entry.toxic_dogs) ? 'toxic' : 'not_toxic';
}

/** Cards used by the "Toxic or Not?" game. */
export function quizCards(entries) {
  return (entries || []).filter(isPlayable).map((e) => ({
    common_name: e.common_name,
    species_scientific: e.species_scientific,
    toxic_cats: e.toxic_cats,
    toxic_dogs: e.toxic_dogs,
    toxic_children: e.toxic_children,
    note: e.note,
    source_url: e.source_url,
    answer: correctAnswer(e),
  }));
}
