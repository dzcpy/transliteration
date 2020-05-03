import test from 'tape';
import { defaultOptions } from '../../src/common/slugify';
import { slugify } from '../../src/node';
import { OptionsSlugify } from '../../src/types';

test('#slugify()', (t) => {
  const tests: [string, object | undefined, string][] = [
    ['你好, 世界!', {}, 'ni-hao-shi-jie'],
    ['你好, 世界!', undefined, 'ni-hao-shi-jie'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['你好, 世界!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['你好, 世界!', { uppercase: true }, 'NI-HAO-SHI-JIE'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai'],
    [
      '你好, 世界!',
      {
        replace: [
          ['你好', 'Hello'],
          ['世界', 'World'],
        ],
      },
      'hello-world',
    ],
    [
      '你好, 世界!',
      {
        separator: ', ',
        replace: [
          ['你好', 'Hola'],
          ['世界', 'mundo'],
        ],
        ignore: ['¡', '!'],
        lowercase: false,
      },
      'Hola, mundo!',
    ],
    ['你好, 世界!', {}, 'ni-hao-shi-jie'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['你好, 世界!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai'],
    [
      '你好, 世界!',
      {
        replace: [
          ['你好', 'Hello '],
          ['世界', 'World '],
        ],
      },
      'hello-world',
    ],
    [
      '你好, 世界!',
      {
        separator: ', ',
        replace: [
          ['你好', 'Hola'],
          ['世界', 'mundo'],
        ],
        ignore: ['¡', '!'],
        lowercase: false,
      },
      'Hola, mundo!',
    ],
  ];
  for (const [str, options, slug] of tests) {
    t.equal(slugify(str, options), slug, `${str}-->${slug}`);
  }
  t.end();
});

test('#slugify.config()', (tt) => {
  test('Get config', (t) => {
    slugify.config(defaultOptions);
    t.deepEqual(slugify.config(), defaultOptions, 'read current config');
    slugify.config(undefined, true);
    t.end();
  });

  test('Generate slugs', (t) => {
    const tests: [string, OptionsSlugify, string][] = [];
    for (const [str, options, slug] of tests) {
      slugify.config(options);
      t.equal(slugify(str), slug, `${str}-->${slug}`);
    }
    t.end();
  });
  tt.end();
});
