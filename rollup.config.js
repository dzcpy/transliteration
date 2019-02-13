import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import hashbang from 'rollup-plugin-hashbang';
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

const typescriptOptions = {
  tsconfigOverride: {
    compilerOptions: {
      module: 'es2015',
      declaration: false,
    },
    include: ['src'],
    exclude: ['src/browser', 'src/cli'],
  },
};

const babelOptions = {
  babelHelpers: 'bundled',
  extensions: ['.js', '.ts'],
};

export default [
  // Browser UMD build
  {
    input: 'src/browser/index.ts',
    output: { name: 'window', file: pkg.browser, format: 'umd', sourcemap: true, extend: true },
    plugins: [
      typescript(typescriptOptions),
      babel(babelOptions),
      terser(),
      sourceMaps(),
    ],
  },
  // Browser ESM module
  {
    input: 'src/browser/index.ts',
    output: { file: pkg.module, format: 'esm', sourcemap: true },
    plugins: [
      typescript(typescriptOptions),
      terser(),
      sourceMaps(),
    ],
  },
  // Node CLI bin transliteration file
  {
    input: 'src/cli/transliterate.ts',
    output: { file: pkg.bin.transliterate, format: 'cjs' },
    plugins: [
      typescript(typescriptOptions),
      terser(),
      hashbang(),
    ],
  },
  // Node CLI bin slugify file
  {
    input: 'src/cli/slugify.ts',
    output: { file: pkg.bin.slugify, format: 'cjs' },
    plugins: [
      typescript(typescriptOptions),
      terser(),
      hashbang(),
    ],
  },
];
