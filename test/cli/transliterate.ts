import execa from 'execa';
import { unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import test from 'tape';
import { OptionReplaceCombined, OptionsTransliterate } from '../../src/types';

const execPath = 'npx ts-node src/cli/transliterate.ts';
const cmdOptions = {
  cwd: join(__dirname, '../../'),
  shell: true,
  stripFinalNewline: false,
};

const escape = (str: string): string =>
  str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const tr = (str: string, options: OptionsTransliterate = {}): string => {
  str = escape(str);
  let args = '';
  if (Array.isArray(options.ignore)) {
    args += options.ignore
      .map((s: string): string => ` -i "${escape(s)}"`)
      .join('');
  }
  if (Array.isArray(options.replace)) {
    args += options.replace
      .map(
        (s: [string | RegExp, string]): string =>
          ` -r "${escape(s[0] as string)}=${escape(s[1])}"`,
      )
      .join('');
  }
  const [trailingSpaces] = str.match(/[\r\n]+$/) || [''];
  const { stdout } = execa.sync(`${execPath} "${str}"${args}`, cmdOptions);
  return stdout.replace(/[\r\n]+$/, '') + trailingSpaces;
};

test('#transliterate()', (tt) => {
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

  test('- With ignore option', (t) => {
    const tests: [string, string[], string][] = [
      ['Æneid', ['Æ'], 'Æneid'],
      ['你好，世界！', ['，', '！'], 'Ni Hao， Shi Jie！'],
      ['你好，世界！', ['你好', '！'], '你好, Shi Jie！'],
    ];
    for (const [str, ignore, result] of tests) {
      t.equal(tr(str, { ignore }), result, `${str}-->${result}`);
    }
    t.end();
  });

  test('- With replace option', (t) => {
    const tests: [string, string[] | object, string][] = [
      ['你好，世界！', [['你好', 'Hola']], 'Hola, Shi Jie!'],
    ];
    for (const [str, replace, result] of tests) {
      t.equal(
        tr(str, { replace: replace as OptionReplaceCombined }),
        result,
        `${str}-->${result} with ${typeof replace} option`,
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
    t.end();
  });

  test('- Stream input', (t) => {
    const filename = join(
      tmpdir(),
      Math.floor(Math.random() * 10000000).toString(16) + '.txt',
    );
    writeFileSync(filename, '你好，世界！');
    const { stdout } = execa.sync(`${execPath} -S < ${filename}`, {
      ...cmdOptions,
    });
    unlinkSync(filename);
    t.equal(stdout, 'Ni Hao, Shi Jie!\n');
    t.end();
  });

  test('- Invalid argument', (t) => {
    const { stderr } = execa.sync(`${execPath} -abc`, { ...cmdOptions });
    t.true(
      /Invalid argument\. Please type '.*? --help' for help\./.test(stderr),
    );
    t.end();
  });

  tt.end();
});
