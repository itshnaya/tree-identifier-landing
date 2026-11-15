// Placeholder convention in /content:
//   "[À CONFIRMER]"                → information missing
//   "[À CONFIRMER] proposed text"  → Claude's proposal, waiting for Claire's "yes"
// Both count as "to confirm". In preview/dev they show with a gold badge;
// in production they are hidden (see src/lib/mode.js).
export const TBC = '[À CONFIRMER]';

/** True when a value is missing or still marked [À CONFIRMER]. */
export function isTBC(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '' || value.includes(TBC);
  return false;
}

/** The proposed text after the marker ('' when there is no proposal). */
export function proposalOf(value) {
  if (typeof value !== 'string' || !value.includes(TBC)) return '';
  return value.replace(TBC, '').trim();
}

/** Recursively lists every content path whose value is [À CONFIRMER]. */
export function findTBC(obj, path = '') {
  const out = [];
  if (typeof obj === 'string') {
    if (obj.includes(TBC)) out.push(path);
  } else if (Array.isArray(obj)) {
    obj.forEach((v, i) => out.push(...findTBC(v, `${path}[${i}]`)));
  } else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) out.push(...findTBC(v, path ? `${path}.${k}` : k));
  }
  return out;
}
