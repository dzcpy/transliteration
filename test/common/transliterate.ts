/**
 * Tests are taken from Text-Unidecode-0.04/test.pl
 *
 * @see <http://search.cpan.org/~sburke/Text-Unidecode-0.04/lib/Text/Unidecode.pm>
 */
import test from 'tape';
import { defaultOptions, Transliterate } from '../../src/common/transliterate';
import { transliterate as tr } from '../../src/node';
import {
  OptionReplaceArray,
  OptionReplaceCombined,
  OptionReplaceObject,
} from '../../src/types';
import { charmap } from './../../data/charmap';

test('#transliterate()', (tt) => {
  test('- Purity tests', (t) => {
    const tests = [];
    for (let i = 1; tests.length < 127; ) {
      tests.push(String.fromCharCode(i++));
    }

    tests.forEach((str) => {
      t.equal(tr(str), str, `${str.charCodeAt(0).toString(16)} ${str}`);
    });
    t.end();
  });

  test('- Basic string tests', (t) => {
    const tests: (string | number)[] = [
      '',
      1 / 10,
      'I like pie.',
      '\n',
      '\r\n',
      'I like pie.\n',
    ];

    tests.forEach((str) => {
      t.equal(tr(str.toString()), str.toString(), str as string);
    });
    t.end();
  });

  test('- Complex tests', (t) => {
    const tests: [string, string][] = [
      ['Æneid', 'AEneid'],
      ['étude', 'etude'],
      ['北亰', 'Bei Jing'],
      //  Chinese
      ['ᔕᓇᓇ', 'shanana'],
      //  Canadian syllabics
      ['ᏔᎵᏆ', 'taliqua'],
      //  Cherokee
      ['ܦܛܽܐܺ', "ptu'i"],
      //  Syriac
      ['अभिजीत', 'abhijiit'],
      //  Devanagari
      ['অভিজীত', 'abhijiit'],
      //  Bengali
      ['അഭിജീത', 'abhijiit'],
      //  Malayalaam
      ['മലയാലമ്', 'mlyaalm'],
      //  the Malayaalam word for 'Malayaalam'
      //  Yes, if we were doing it right, that'd be 'malayaalam', not 'mlyaalm'
      ['げんまい茶', 'genmaiCha'],
      //  Japanese, astonishingly unmangled.
      [`\u0800\u1400${unescape('%uD840%uDD00')}`, ''],
      // Unknown characters
    ];

    for (const [str, result] of tests) {
      t.equal(tr(str), result, `${str}-->${result}`);
    }
    t.end();
  });

  test('- With ignore option', (t) => {
    const tests: [string, string[], string][] = [
      ['Æneid', ['Æ'], 'Æneid'],
      ['你好，世界！', ['，', '！'], 'Ni Hao，Shi Jie！'],
      ['你好，世界！', ['你好', '！'], '你好,Shi Jie！'],
    ];
    for (const [str, ignore, result] of tests) {
      t.equal(tr(str, { ignore }), result, `${str}-->${result}`);
    }
    t.end();
  });

  test('- With replace option', (t) => {
    const tests: [string, string[] | object, string][] = [
      ['你好，世界！', [['你好', 'Hola']], 'Hola,Shi Jie!'],
      ['你好，世界！', { 你好: 'Hola' }, 'Hola,Shi Jie!'],
      ['你好，世界!', { 好: 'Good' }, 'Ni Good,Shi Jie!'],
    ];
    for (const [str, replace, result] of tests) {
      t.equal(
        tr(str, { replace: replace as OptionReplaceCombined }),
        result,
        `${str}-->${result} with ${typeof replace} option`,
      );
    }
    t.equal(
      tr('你好，世界！', {
        replace: { 好: 'Good' },
        ignore: ['界'],
      }),
      'Ni Good,Shi 界!',
    );
    t.end();
  });

  test('- With replaceAfter option', (t) => {
    const tests: [string, string[] | object, string][] = [
      ['你好，世界！', [['Ni Hao', 'Hola']], 'Hola,Shi Jie!'],
      ['你好，世界！', { 'Ni Hao': 'Hola' }, 'Hola,Shi Jie!'],
    ];
    for (const [str, replaceAfter, result] of tests) {
      t.equal(
        tr(str, { replaceAfter: replaceAfter as OptionReplaceCombined }),
        result,
        `${str}-->${result} with ${typeof replaceAfter} option`,
      );
    }
    t.end();
  });

  test('- With replace / replaceAfter and ignore options', (t) => {
    t.equal(
      tr('你好, 世界!', {
        replace: [
          ['你好', 'Hola'],
          ['世界', 'mundo'],
        ],
        ignore: ['¡', '!'],
      }),
      'Hola, mundo!',
    );
    t.equal(
      tr('你好，世界！', { replaceAfter: [['你', 'tú']], ignore: ['你'] }),
      'tú Hao,Shi Jie!',
      `你好，世界！-->tú Hao,Shi Jie! with 你-->tú replaceAfter option and ignore 你`,
    );
    t.end();
  });

  test('- With trim option', (t) => {
    t.equal(
      tr(' \t\r\n你好，世界！\t\r\n ', { trim: true }),
      'Ni Hao,Shi Jie!',
    );
    t.equal(
      tr(' \t\r\n你好，世界！\t\r\n ', { trim: false }),
      ' \t\r\nNi Hao,Shi Jie!\t\r\n ',
    );
    t.end();
  });

  test('- With unknown option', (t) => {
    t.equal(tr('🚀', { unknown: '?' }), '?');
    t.end();
  });

  tt.end();
});

test('#replaceStr()', (t) => {
  const transliterate = new Transliterate();
  const replaceString = transliterate.replaceString.bind(transliterate);
  const tests: [string, any[], string][] = [
    [
      'abbc',
      [
        ['a', 'aa'],
        [/b+/g, 'B'],
      ],
      'aaBc',
    ],
    ['abbc', [[false, '']], 'abbc'],
  ];
  for (const [str, replace, result] of tests) {
    t.equal(replaceString(str, replace), result, `${str}->${result}`);
  }
  t.end();
});

test('#transliterate.config()', (t) => {
  tr.config(defaultOptions);
  t.deepEqual(tr.config(), defaultOptions, 'read current config');
  tr.config(undefined, true);
  t.deepEqual(tr.config(), {});
  t.end();
});

test('#transliterate.setData()', (t) => {
  const map = { a: 'A', b: 'B', c: 'C' };
  tr.setData(map);
  t.deepEqual(tr.setData(map), { ...charmap, ...map }, 'set custom codemap');
  t.equal(tr('abc'), 'ABC', 'transliterate with custom codemap');
  t.deepEqual(
    tr.setData(undefined, true),
    charmap,
    'read current custom codemap',
  );
  t.equal(tr('abc'), 'abc', 'transliterate with codemap reset');
  t.end();
});

test('#formatReplaceOption', (t) => {
  const transliterate = new Transliterate();
  const formatReplaceOption = transliterate.formatReplaceOption.bind(
    transliterate,
  );
  const optObj: OptionReplaceObject = { a: 'b', c: 'd' };
  const optArr: OptionReplaceArray = [
    ['a', 'b'],
    ['c', 'd'],
  ];
  t.deepEqual(formatReplaceOption(optObj), optArr, 'object option');
  t.deepEqual(formatReplaceOption(optArr), optArr, 'array option"');
  t.notEqual(
    formatReplaceOption(optArr),
    optArr,
    'returns new copy of the array',
  );
  t.end();
});
