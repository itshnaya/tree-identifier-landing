// Web payment for Premium (Stripe Payment Links, configured by the partner in /content/site.json).
// Payment mode switches on as soon as one plan has a real payment link; until then the page
// keeps the official store badges (which always link to the stores, as Apple and Google require).
import { site } from './content.js';
import { isTBC } from './tbc.js';

export const plans = site.premium.plans.map((p) => ({ ...p, link: isTBC(p.stripe_payment_link) ? '' : p.stripe_payment_link }));
export const paymentMode = plans.some((p) => p.link);
