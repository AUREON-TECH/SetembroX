import assert from 'node:assert/strict';
import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
assert.equal(manifest.display, 'standalone', 'manifest must use standalone display');
assert.ok(manifest.name && manifest.short_name && manifest.start_url && manifest.scope, 'manifest identity is incomplete');

const icons = manifest.icons || [];
const icon192 = icons.find((icon) => icon.sizes === '192x192' && icon.type === 'image/png');
const icon512 = icons.find((icon) => icon.sizes === '512x512' && icon.type === 'image/png' && !String(icon.purpose || '').includes('maskable'));
const maskable = icons.find((icon) => icon.sizes === '512x512' && icon.type === 'image/png' && String(icon.purpose || '').includes('maskable'));
assert.ok(icon192, 'manifest needs a 192x192 PNG icon');
assert.ok(icon512, 'manifest needs a 512x512 PNG icon');
assert.ok(maskable, 'manifest needs a 512x512 maskable PNG icon');
for (const icon of [icon192, icon512, maskable]) {
  const path = icon.src.replace(/^\.\//, '');
  assert.ok(fs.existsSync(path), `missing icon file: ${path}`);
}

const sw = fs.readFileSync('sw.js', 'utf8').toLowerCase();
for (const marker of ['authorization', 'cookie', 'range', 'if-range', 'no-store', 'private', 'set-cookie', 'content-range', 'supabase', '/api/', 'vary']) {
  assert.ok(sw.includes(marker), `service worker cache policy must handle: ${marker}`);
}
assert.ok(sw.includes('response.status === 206') || sw.includes('response.status!==206') || sw.includes('response.status != 206'), 'service worker must reject partial responses');

const html = fs.readFileSync('index.html', 'utf8');
assert.match(html, /rel=["']manifest["'][^>]*manifest\.webmanifest/i, 'index must link manifest.webmanifest');
assert.match(html, /theme-color/i, 'index needs a theme-color meta tag');
assert.match(html, /apple-mobile-web-app-capable/i, 'index needs Apple mobile PWA meta');
assert.match(html, /serviceWorker\.register\([^)]*sw\.js\?v=/s, 'service worker registration must be versioned');
assert.match(html, /updateViaCache\s*:\s*["']none["']/s, 'service worker registration must bypass HTTP cache for updates');

console.log('SETEMBRO X PWA audit passed');
