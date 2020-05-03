#!/usr/bin/env node

import { basename } from 'path';
import yargs from 'yargs';
import { defaultOptions } from '../common/transliterate';
import { deepClone } from '../common/utils';
import { transliterate as tr } from '../node/index';
import { OptionsTransliterate } from '../types';
import { parseReplaceOption } from './common';

const STDIN_ENCODING = 'utf-8';
const options: OptionsTransliterate = deepClone(defaultOptions);

const { argv } = yargs
  .version()
  .usage('Usage: $0 <unicode> [options]')
  .option('u', {
    alias: 'unknown',
    default: options.unknown,
    describe: 'Placeholder for unknown characters',
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
    'Replace `,` into `!`, `world` into `shijie`.\nResult: Ni good, Shi Jie!',
  )
  .example(
    '$0 "你好，世界!" -i 你好 -i ，',
    'Ignore `你好` and `，`.\nResult: 你好，Shi Jie !',
  )
  .wrap(100);

options.unknown = argv.unknown as string;
options.replace = parseReplaceOption(argv.replace as string[]);
options.ignore = argv.ignore as string[];

if (argv.stdin) {
  process.stdin.setEncoding(STDIN_ENCODING);
  process.stdin.on('readable', () => {
    const chunk: string = process.stdin.read() as string;
    if (chunk !== null) {
      process.stdout.write(tr(chunk, options));
    }
  });
  process.stdin.on('end', () => console.log(''));
} else {
  if (argv._.length !== 1) {
    console.error(
      `Invalid argument. Please type '${basename(argv.$0)} --help' for help.`,
    );
  } else {
    console.log(tr(argv._[0], options));
  }
}
