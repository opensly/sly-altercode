const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node16',
  outfile: 'dist/index.js',
  format: 'esm',
  banner: {
    js: '#!/usr/bin/env node'
  },
  external: ['fs', 'path'], // Don't bundle Node.js native modules
  minify: false,
  sourcemap: true,
}).catch(() => process.exit(1));
