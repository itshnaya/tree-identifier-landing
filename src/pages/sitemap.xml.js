import site from '../../content/site.json';
import { isTBC } from '../lib/tbc.js';
export function GET() {
  const body = isTBC(site.site_url)
    ? '<!-- site_url [À CONFIRMER] in content/site.json: the sitemap fills in automatically once it is set. -->'
    : `<url><loc>${site.site_url.replace(/\/$/, '')}/</loc></url>`;
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } });
}
