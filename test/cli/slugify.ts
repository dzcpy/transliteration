import { exec, ExecException } from 'child_process';
import { unlinkSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import test from 'tape';

import { OptionsSlugify } from '../../src/types';

const execAsync = async (
  command: string,
): Promise<{ stdout: string; stderr: string }> =>
  new Promise((resolve, reject) => {
    exec(
      command,
      { cwd: join(__dirname, '../../') },
      (error: ExecException | null, stdout: string, stderr: string) => {
        if (error) {
          reject(stderr);
        } else {
          resolve({ stdout, stderr });
        }
      },
    );
  });

const execPath = 'npx ts-node src/cli/slugify';

const escape = (str: string): string =>
  str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');

const slugify = async (
  str: string,
  options: OptionsSlugify = {},
): Promise<string> => {
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
  const { stdout } = await execAsync(`${execPath} "${str}"${args}`);
  return stdout + trailingSpaces;
};

test('#slugify()', (tt) => {
  const tests: [string, object, string][] = [
    ['你好, 世界!', {}, 'ni-hao-shi-jie\n'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie\n'],
    ['你好, 世界!', { uppercase: true }, 'NI-HAO-SHI-JIE\n'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!\n'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai\n'],
    [
      '你好, 世界!',
      {
        replace: [
          ['你好', 'Hello'],
          ['世界', 'World'],
        ],
      },
      'hello-world\n',
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
      'hola, mundo!\n',
    ],
    ['你好, 世界!', {}, 'ni-hao-shi-jie\n'],
    ['你好, 世界!', { separator: '_' }, 'ni_hao_shi_jie\n'],
    ['你好, 世界!', { ignore: ['!', ','] }, 'ni-hao,-shi-jie!\n'],
    ['你好, 世界!', { replace: [['世界', '未来']] }, 'ni-hao-wei-lai\n'],
    [
      '你好, 世界!',
      {
        replace: [
          ['你好', 'Hello '],
          ['世界', 'World '],
        ],
      },
      'hello-world\n',
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
      'hola, mundo!\n',
    ],
  ];

  test('Generate slugs', async (t) => {
    for (const [str, options, slug] of tests) {
      t.equal(await slugify(str, options), slug, `${str}-->${slug}`);
    }
    t.end();
  });

  test('- Stream input', async (t) => {
    const filename = join(
      tmpdir(),
      Math.floor(Math.random() * 10000000).toString(16) + '.txt',
    );
    writeFileSync(filename, '你好，世界！');
    const { stdout } = await execAsync(`${execPath} -S < ${filename}`);
    unlinkSync(filename);
    t.equal(stdout, 'ni-hao-shi-jie\n');
    t.end();
  });

  test('- Invalid argument', async (t) => {
    const { stderr } = await execAsync(`${execPath} -abc`);
    t.true(
      /Invalid argument\. Please type '.*? --help' for help\./.test(stderr),
    );
    t.end();
  });

  tt.end();
});
