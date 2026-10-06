/**
 * build-js.mjs — bundles assets/src/aranya.js (with its private copy of
 * Alpine.js) into assets/js/aranya.js, one deferred file.
 * Usage: node build/build-js.mjs [--watch]
 */
import * as esbuild from 'esbuild';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const plugin = join(here, '..', 'plugin', 'aranya-core', 'assets');
const options = {
  entryPoints: [join(plugin, 'src', 'aranya.js')],
  outfile: join(plugin, 'js', 'aranya.js'),
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2019'],
  legalComments: 'eof',
  logLevel: 'info',
};
if (process.argv.includes('--watch')) (await esbuild.context(options)).watch();
else await esbuild.build(options);
