// Placeholder convention: any missing info is written "[À CONFIRMER]" in /content.
export const TBC = '[À CONFIRMER]';

/** True when a value is missing or still marked [À CONFIRMER]. */
export function isTBC(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '' || value.includes(TBC);
  return false;
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
