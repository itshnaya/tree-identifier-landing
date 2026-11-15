import site from '../../content/site.json';
import { isTBC } from '../lib/tbc.js';
export function GET() {
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /get/'];
  if (!isTBC(site.site_url)) lines.push(`Sitemap: ${site.site_url.replace(/\/$/, '')}/sitemap.xml`);
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain' } });
}
