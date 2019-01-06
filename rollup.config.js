import babel from 'rollup-plugin-babel';
import { terser } from "rollup-plugin-terser";
import typescript from 'rollup-plugin-typescript2';
import hashbang from 'rollup-plugin-hashbang';
import copy from 'rollup-plugin-copy';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
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
  presets: [[
    '@babel/preset-env', {
      useBuiltIns: 'usage',
      targets: [
        'IE 9-11',
        'last 2 Edge versions',
        'last 2 Chrome versions',
        'last 2 Safari versions',
        'last 2 Firefox versions'
      ],
      loose: true,
    }
  ]],
  plugins: ['@babel/plugin-proposal-object-rest-spread', '@babel/plugin-transform-for-of'],
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
		],
  },
  	// Browser test
	{
		input: 'test/browser/index.ts',
    output: { file: 'dist/browser/test/index.js', format: 'iife', sourcemap: true },
    plugins: [
      copy({ 'test/browser/index.html': 'dist/browser/test/index.html'}),
      typescript(typescriptOptions),
      resolve(),
      commonjs(),
      babel(babelOptions),
      terser(),
		],
  },
  // Node ESM module
	{
		input: 'src/node/index.ts',
    output: { file: pkg.module, format: 'esm' },
    plugins: [
      typescript(typescriptOptions),
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
