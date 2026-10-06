/**
 * package.mjs — builds the three uploads in wordpress/dist/:
 *
 *   aranya-theme.zip   Appearance → Themes → Add New → Upload
 *   aranya-core.zip    Plugins → Add New → Upload (needs Elementor)
 *   aranya-media.zip   extract into wp-content/uploads/aranya-import/, then
 *                      run Aranya → Install Content
 *
 * The media pack holds only what the site uses: every image/film path the
 * widgets and settings reference, plus each image's srcset ladder.
 */
import archiver from 'archiver';
import { createWriteStream, existsSync, mkdirSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const repo = join(root, '..');
const dist = join(root, 'dist');
mkdirSync(dist, { recursive: true });

function zipDir(src, prefix, out, skip = () => false) {
  return new Promise((resolve, reject) => {
    const output = createWriteStream(out);
    const zip = archiver('zip', { zlib: { level: 9 } });
    output.on('close', () => resolve(zip.pointer()));
    zip.on('error', reject);
    zip.pipe(output);
    const walk = (dir, rel) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f), r = rel ? `${rel}/${f}` : f;
        if (skip(r)) continue;
        statSync(p).isDirectory() ? walk(p, r) : zip.file(p, { name: `${prefix}/${r}` });
      }
    };
    walk(src, '');
    zip.finalize();
  });
}

// Media: paths named in the plugin's PHP, expanded to their srcset ladders.
const phpFiles = [];
const collect = (dir) => readdirSync(dir).forEach((f) => { const p = join(dir, f); statSync(p).isDirectory() ? collect(p) : f.endsWith('.php') && phpFiles.push(p); });
collect(join(root, 'plugin', 'aranya-core', 'includes'));
const manifestSrc = readFileSync(join(root, 'plugin', 'aranya-core', 'includes', 'media-manifest.php'), 'utf8');
const ladders = {};
for (const m of manifestSrc.matchAll(/^\t'([^']+)' => array\(.*'ladder' => array\( (.*) \) \),$/gm)) {
  ladders[m[1]] = [...m[2].matchAll(/array\( '([^']+)', \d+ \)/g)].map((x) => x[1]);
}
const used = new Set();
for (const f of phpFiles) {
  if (f.endsWith('media-manifest.php')) continue;
  // Code only: doc comments carry example paths such as 'opt/x-2000.webp'.
  const code = readFileSync(f, 'utf8').split('\n').filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l)).join('\n');
  for (const m of code.matchAll(/'((?:opt|branding|video)\/[\w.-]+|[\w-]+\.(?:png|jpe?g|webp|mp4))'/g)) used.add(m[1]);
}
const files = new Set();
for (const path of used) {
  const dir = path.includes('/') ? path.slice(0, path.lastIndexOf('/') + 1) : '';
  (ladders[basename(path)] || [basename(path)]).forEach((f) => files.add(dir + f));
}
const assets = join(repo, 'public', 'assets');
// A bare name (the navbar's density ladder) resolves next to the chosen logo, so
// it only counts as missing when no packed folder holds it.
const missing = [...files].filter((f) => !existsSync(join(assets, f)) && ![...files].some((g) => g.endsWith('/' + f) && existsSync(join(assets, g))));

const packed = [...files].filter((f) => existsSync(join(assets, f))).sort();

const mediaZip = await new Promise((resolve, reject) => {
  const output = createWriteStream(join(dist, 'aranya-media.zip'));
  const zip = archiver('zip', { zlib: { level: 1 } }); // images/films are already compressed
  output.on('close', () => resolve(zip.pointer()));
  zip.on('error', reject);
  zip.pipe(output);
  packed.forEach((f) => zip.file(join(assets, f), { name: f }));
  zip.finalize();
});

const theme = await zipDir(join(root, 'theme', 'aranya'), 'aranya', join(dist, 'aranya-theme.zip'));
const plugin = await zipDir(join(root, 'plugin', 'aranya-core'), 'aranya-core', join(dist, 'aranya-core.zip'));

const mb = (n) => (n < 1048576 ? (n / 1024).toFixed(0) + ' KB' : (n / 1048576).toFixed(1) + ' MB');
console.log(`aranya-theme.zip  ${mb(theme)}`);
console.log(`aranya-core.zip   ${mb(plugin)}`);
console.log(`aranya-media.zip  ${mb(mediaZip)}  (${packed.length} files)`);
if (missing.length) console.log('missing media:', missing.join(', '));
