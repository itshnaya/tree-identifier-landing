// Generates favicons and the share image from assets/logo.png and assets/monty.png.
// Run: npm run icons  (outputs are committed in /public)
import sharp from 'sharp';
await sharp('assets/logo.png').resize(32, 32).png().toFile('public/favicon-32.png');
await sharp('assets/logo.png').resize(192, 192).png().toFile('public/icon-192.png');
await sharp('assets/logo.png').resize(180, 180).png().toFile('public/apple-touch-icon.png');
// .ico wrapping a 32px PNG (valid ICO with PNG payload)
const png = await sharp('assets/logo.png').resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(32, 6); header.writeUInt8(32, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
const fs = await import('node:fs');
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, png]));
// Share image 1200x630: Monty on the forest green background + logo.
const monty = await sharp('assets/monty.png').resize(560, 560).png().toBuffer();
const mask = Buffer.from('<svg width="560" height="560"><rect width="560" height="560" rx="48" fill="#fff"/></svg>');
const montyRounded = await sharp(monty).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
const logo = await sharp('assets/logo.png').resize(140, 140).png().toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0A3927' } })
  .composite([{ input: montyRounded, left: 580, top: 35 }, { input: logo, left: 220, top: 245 }])
  .jpeg({ quality: 85 }).toFile('public/og-image.jpg');
console.log('icons + og image done');
