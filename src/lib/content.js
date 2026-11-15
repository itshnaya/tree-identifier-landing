// Single entry point to /content. Never hard-code page text in components.
import site from '../../content/site.json';
import cast from '../../content/cast.json';
import series from '../../content/series.json';
import toxicity from '../../content/toxicity.json';
import { quizCards, isVerified } from './toxicity.js';

const previewUnverified = import.meta.env.DEV && process.env.QUIZ_PREVIEW_UNVERIFIED === '1';

export { site, cast, series, toxicity };

/** Cards for the game. Unverified cards only in local dev preview mode (never in build). */
export const cards = previewUnverified
  ? quizCards(toxicity.map((e) => (isVerified(e) ? e : { ...e, verified_at: '2000-01-01' })))
  : quizCards(toxicity);
export const isQuizPreview = previewUnverified;
