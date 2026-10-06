/**
 * fetch-fonts.mjs — self-host the exact Source Serif 4 files Google Fonts serves.
 *
 * The React site loads Source Serif 4 from Google Fonts with this URL. Fetching
 * it with a current Chrome user agent returns the same WOFF2 subsets a visitor
 * gets, so the glyphs, axes (opsz 8–60, wght 500–800 / italic 500–700) and
 * unicode ranges are identical — only the host changes. Output:
 *   plugin/aranya-core/assets/fonts/*.woff2 + fonts.css
 *
 * Run once, or again if the family URL in index.html changes.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dir = join(here, '..', 'plugin', 'aranya-core', 'assets', 'fonts');
mkdirSync(dir, { recursive: true });

const CSS_URL =
  'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,500..800;1,8..60,500..700&display=swap';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const css = await (await fetch(CSS_URL, { headers: { 'User-Agent': UA } })).text();

let out = css;
let n = 0;
// Google's CSS is a run of "/* subset */ @font-face { … }" blocks.
for (const [, subset, body] of css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g)) {
  const url = /url\((https:[^)]+)\)/.exec(body)[1];
  const style = /font-style:\s*(\w+)/.exec(body)[1];
  const name = `source-serif-4-${style}-${subset}.woff2`;
  const buf = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  writeFileSync(join(dir, name), buf);
  out = out.replace(url, `./${name}`);
  n++;
}

writeFileSync(join(dir, 'fonts.css'), `/* Self-hosted copy of ${CSS_URL} */\n${out}`);
console.log(`fonts: ${n} files`);
