import tape from 'tape';
import 'tape-catch';
import { defaultOptions as slugifyOptions } from '../../src/common/slugify';
import { defaultOptions as translOptionss } from '../../src/common/transliterate';
import { BrowserGlobalObject, OptionReplaceCombined, OptionsSlugify } from '../../src/types';

// import { slugify, transliterate as tr } from '../../src/node/index';
declare var window: BrowserGlobalObject;
declare var BrowserStack: any;

const { slugify, transl: tr } = window;

/**
 * @borrows https://github.com/TehShrike/browserstack-tape-reporter
 */
const test = tape.createHarness();
(() => {
  const start = new Date();
  let logs = '';

  const pollReport = () => BrowserStack ? postLogs() : setTimeout(pollReport, 500);

  const postLogs = () => logs ? BrowserStack.post('/_log', '\n' + logs + '\n ', postReport) : postReport();

  const postReport = () => {
    const results = (test as any)._results;
    BrowserStack.post('/_report', {
      failed: results.fail,
      passed: results.pass,
      runtime: new Date().getTime() - start.getTime(),
      total: results.count,
      tracebacks: []
    }, () => undefined);
  };

  test.createStream()
  .on('data', line => logs += line)
  .on('close', pollReport);

})();

test('#transliterate()', tt => {
  test('- Purity tests', t => {
    const tests = [];
    for (let i = 1; tests.length < 127; tests.push(String.fromCharCode(i++))) {; }

    tests.forEach((str) => {
      t.equal(tr(str), str, `${str.charCodeAt(0).toString(16)} ${str}`);
    });
    t.end();
  });

  test('- Basic string tests', t => {
    const tests: Array<string | number> = [
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

  test('- Complex tests', t => {
    const tests: Array<[string, string]> = [
      ['Æneid', 'AEneid'],
      ['étude', 'etude'],
      ['北亰', 'Bei Jing'],
      //  Chinese
      ['ᔕᓇᓇ', 'shanana'],
      //  Canadian syllabics
      ['ᏔᎵᏆ', 'taliqua'],
      //  Cherokee
      ['ܦܛܽܐܺ', 'ptu\'i'],
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
      ['げんまい茶', 'genmai Cha'],
      //  Japanese, astonishingly unmangled.
      [`\u0800\u1400${unescape('%uD840%uDD00')}`, ''],
      // Unknown characters
    ];

    for (const [str, result] of tests) {
      t.equal(tr(str), result, `${str}-->${result}`);
    }
    t.end();
  });

  test('- With ignore option', t => {
    const tests: Array<[string, string[], string]> = [
      ['Æneid', ['Æ'], 'Æneid'],
      ['你好，世界！', ['，', '！'], 'Ni Hao， Shi Jie！'],
      ['你好，世界！', ['你好', '！'], '你好, Shi Jie！'],
    ];
    for (const [str, ignore, result] of tests) {
      t.equal(tr(str, { ignore }), result, `${str}-->${result}`);
    }
    t.end();
  });

  test('- With replace option', t => {
    const tests: Array<[string, string[] | object, string]> = [
      ['你好，世界！', [['你好', 'Hola']], 'Hola, Shi Jie!'],
      ['你好，世界！', { '你好': 'Hola' }, 'Hola, Shi Jie!'],
    ];
    for (const [str, replace, result] of tests) {
      t.equal(tr(str, { replace: replace as OptionReplaceCombined }), result, `${str}-->${result} with ${typeof replace} option`);
    }
    t.end();
  });

  test('- With replaceAfter option', t => {
    const tests: Array<[string, string[] | object, string]> = [
      ['你好，世界！', [['Ni Hao', 'Hola']], 'Hola, Shi Jie!'],
      ['你好，世界！', { 'Ni Hao': 'Hola' }, 'Hola, Shi Jie!'],
    ];
    for (const [str, replaceAfter, result] of tests) {
      t.equal(tr(str, { replaceAfter: replaceAfter as OptionReplaceCombined }), result, `${str}-->${result} with ${typeof replaceAfter} option`);
    }
    t.end();
  });

  test('- With replace / replaceAfter and ignore options', t => {
    t.equal(tr('你好, 世界!', { replace: [['你好', 'Hola'], ['世界', 'mundo']], ignore: ['¡', '!'] }), 'Hola, mundo!', );
    t.equal(tr('你好，世界！', { replaceAfter: [['你', 'tú']], ignore: ['你'] }), 'tú Hao, Shi Jie!', `你好，世界！-->tú Hao, Shi Jie! with 你-->tú replaceAfter option and ignore 你`);
    t.end();
  });

  test('- With trim option', t => {
    t.equal(tr(' \t\r\n你好，世界！\t\r\n ', { trim: true }), 'Ni Hao, Shi Jie!');
    t.equal(tr(' \t\r\n你好，世界！\t\r\n ', { trim: false }), ' \t\r\nNi Hao, Shi Jie!\t\r\n ');
    t.end();
  });

  tt.end();
});


test('#transliterate.config()', t => {
  tr.config(translOptionss);
  t.deepEqual(tr.config(), translOptionss, 'read current config');
  tr.config(undefined, true);
  t.deepEqual(tr.config(), {});
  t.end();
});


test('#slugify()', tt => {
  const tests: Array<[string, object, string]> = [
    ['你好, 世界!', {}, 'ni-hao-shi-jie'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['你好, 世界!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['你好, 世界!', { uppercase: true }, 'NI-HAO-SHI-JIE'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai'],
    ['你好, 世界!', { replace: [['你好', 'Hello'], ['世界', 'World']] }, 'hello-world'],
    ['你好, 世界!', { separator: ', ', replace: [['你好', 'Hola'], ['世界', 'mundo']], ignore: ['¡', '!'], lowercase: false }, 'Hola, mundo!'],
    ['你好, 世界!', {}, 'ni-hao-shi-jie'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['你好, 世界!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai'],
    ['你好, 世界!', { replace: [['你好', 'Hello '], ['世界', 'World ']] }, 'hello-world'],
    ['你好, 世界!', { separator: ', ', replace: [['你好', 'Hola'], ['世界', 'mundo']], ignore: ['¡', '!'], lowercase: false }, 'Hola, mundo!'],
  ];
  test('Generate slugs', t => {
    for (const [str, options, slug] of tests) {
      t.equal(slugify(str, options), slug, `${str}-->${slug}`);
    }
    t.end();
  });
  tt.end();
});

test('#slugify.config()', tt => {
  test('Get config', t => {
    slugify.config(slugifyOptions);
    t.deepEqual(slugify.config(), slugifyOptions, 'read current config');
    slugify.config(undefined, true);
    t.end();
  });

  test('Generate slugs', t => {
    const tests: Array<[string, OptionsSlugify, string]> = [

    ];
    for (const [str, options, slug] of tests) {
      slugify.config(options);
      t.equal(slugify(str), slug, `${str}-->${slug}`);
    }
    t.end();
  });
  tt.end();
});
