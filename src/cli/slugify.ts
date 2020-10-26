#!/usr/bin/env node

import { basename } from 'path';
import yargs from 'yargs';
import { defaultOptions } from '../common/slugify';
import { deepClone } from '../common/utils';
import { slugify } from '../node';
import { OptionsSlugify } from '../types';
import { parseReplaceOption } from './common';

const STDIN_ENCODING = 'utf-8';
const options: OptionsSlugify = deepClone(defaultOptions);

const { argv } = yargs
  .version()
  .usage('Usage: $0 <unicode> [options]')
  .option('U', {
    alias: 'unknown',
    default: options.unknown,
    describe: 'Placeholder for unknown characters',
    type: 'string',
  })
  .option('l', {
    alias: 'lowercase',
    default: options.lowercase,
    describe: 'Returns result in lowercase',
    type: 'boolean',
  })
  .option('u', {
    alias: 'uppercase',
    default: options.uppercase,
    describe: 'Returns result in uppercase',
    type: 'boolean',
  })
  .options('s', {
    alias: 'separator',
    default: '-',
    describe: 'Separator of the slug',
    type: 'string',
  })
  .option('r', {
    alias: 'replace',
    default: options.replace,
    describe: 'Custom string replacement',
    type: 'array',
  })
  .option('i', {
    alias: 'ignore',
    default: options.ignore,
    describe: 'String list to ignore',
    type: 'array',
  })
  .option('S', {
    alias: 'stdin',
    default: false,
    describe: 'Use stdin as input',
    type: 'boolean',
  })
  .help('h')
  .option('h', {
    alias: 'help',
  })
  .example(
    '$0 "你好, world!" -r 好=good -r "world=Shi Jie"',
    'Replace `,` into `!` and `world` into `shijie`.\nResult: ni-good-shi-jie',
  )
  .example(
    '$0 "你好，世界!" -i 你好 -i ，',
    'Ignore `你好` and `，`.\nResult: 你好，shi-jie',
  )
  .wrap(100);

options.lowercase = !!argv.l;
options.uppercase = !!argv.u;
options.separator = argv.separator as string;
options.replace = parseReplaceOption(argv.replace as string[]);
options.ignore = argv.ignore as string[];

if (argv.stdin) {
  process.stdin.setEncoding(STDIN_ENCODING);
  process.stdin.on('readable', () => {
    const chunk = process.stdin.read() as string;
    if (chunk !== null) {
      process.stdout.write(slugify(chunk, options));
    }
  });
  process.stdin.on('end', () => console.log(''));
} else {
  if (argv._.length !== 1) {
    console.error(
      `Invalid argument. Please type '${basename(argv.$0)} --help' for help.`,
    );
  } else {
    console.log(slugify(argv._[0], options));
  }
}
