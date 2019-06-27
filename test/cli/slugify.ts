import execa from 'execa';
import { unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import test from 'tape';
import { OptionsSlugify } from '../../src/types';

const execPath = 'npx ts-node src/cli/slugify';
const cmdOptions = {
  cwd: join(__dirname, '../../'),
  shell: true,
  stripFinalNewline: false
};

const escape = (str: string): string => str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const slugify = (str: string, options: OptionsSlugify = {}): string => {
  str = escape(str);
  let args = '';
  if (Array.isArray(options.ignore)) {
    args += options.ignore.map((s: string): string => ` -i "${escape(s)}"`).join('');
  }
  if (Array.isArray(options.replace)) {
    args += options.replace.map((s: [string | RegExp, string]): string => ` -r "${escape(s[0] as string)}=${escape(s[1])}"`).join('');
  }
  if (options.lowercase) {
    args += ' -l';
  }
  if (options.uppercase) {
    args += ' -u';
  }
  if (options.separator) {
    args += ` -s "${escape(options.separator)}"`;
  }
  const [trailingSpaces] = str.match(/[\r\n]+$/) || [''];
  const { stdout } = execa.sync(`${execPath} "${str}"${args}`, cmdOptions);
  return stdout + trailingSpaces;
}

test('#slugify()', tt => {
  const tests: Array<[string, object, string]> = [
    ['你好, 世界!', {}, 'ni-hao-shi-jie\n'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie\n'],
    ['你好, 世界!', { uppercase: true }, 'NI-HAO-SHI-JIE\n'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!\n'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai\n'],
    ['你好, 世界!', { replace: [['你好', 'Hello'], ['世界', 'World']] }, 'hello-world\n'],
    ['你好, 世界!', { separator: ', ', replace: [['你好', 'Hola'], ['世界', 'mundo']], ignore: ['¡', '!'], lowercase: false }, 'hola, mundo!\n'],
    ['你好, 世界!', {}, 'ni-hao-shi-jie\n'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie\n'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!\n'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai\n'],
    ['你好, 世界!', { replace: [['你好', 'Hello '], ['世界', 'World ']] }, 'hello-world\n'],
    ['你好, 世界!', { separator: ', ', replace: [['你好', 'Hola'], ['世界', 'mundo']], ignore: ['¡', '!'], lowercase: false }, 'hola, mundo!\n'],
  ];

  test('Generate slugs', t => {
    for (const [str, options, slug] of tests) {
      t.equal(slugify(str, options), slug, `${str}-->${slug}`);
    }
    t.end();
  });

  test('- Stream input', t => {
    const filename = join(tmpdir(), Math.floor(Math.random() * 10000000).toString(16) + '.txt');
    writeFileSync(filename, '你好，世界！');
    const { stdout } = execa.sync(`${execPath} -S < ${filename}`, { ...cmdOptions });
    unlinkSync(filename);
    t.equal(stdout, "ni-hao-shi-jie\n");
    t.end();
  });

  test('- Invalid argument', t => {
    const { stderr } = execa.sync(`${execPath} -abc`, { ...cmdOptions });
    t.true(/Invalid argument\. Please type '.*? --help' for help\./.test(stderr));
    t.end();
  });

  tt.end();
});
