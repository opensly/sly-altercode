import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/altercode.js',
      format: 'cjs'
    },
    {
      file: 'dist/altercode.es.js',
      format: 'es'
    },
    {
      file: 'dist/altercode.min.js',
      format: 'iife',
      name: 'version',
      plugins: [terser()]
    }
  ],
  plugins: [json()]
}
