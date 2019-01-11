import test from 'tape';
import { deepClone, escapeRegExp, findStrOccurrences, inRange, regexpReplaceCustom } from '../../src/common/utils';

test('#escapeRegex()', t => {
  const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\';
  const unescaped = '^$.*+?()[]{}|\\';

  t.equal(escapeRegExp(unescaped + unescaped), escaped + escaped, 'should escape values');

  t.equal(escapeRegExp('abc'), 'abc', 'should handle strings with nothing to escape');

  const values = [null, undefined, ''];
  const expected: string[] = values.map(() => '');
  const actual = values.map((value) => escapeRegExp(value as string));

  t.deepEqual(expected, actual, 'should return an empty string for empty values');
  t.end();
});

test('#findStrOccurrences()', t => {
  const tests: Array<[string, string[], Array<[number, number]>]> = [
    ['test', ['t'], [[0, 0], [3, 3]]],
    ['testtest', ['e', 't'], [[0, 1], [3, 5], [7, 7]]],
    ['你好呀你好', ['你', '呀'], [[0, 0], [2, 3]]],
  ];
  for (const [source, searches, result] of tests) {
    t.deepEqual(findStrOccurrences(source, searches), result, `find ${searches.join(', ')} in ${source}`);
  }
  t.end();
});

test('#inRange()', t => {
  const tests: Array<[number, Array<[number, number]>, boolean]> = [
    [5, [[1, 2], [5, 5], [7, 9]], true],
    [5, [[1, 10]], true],
    [6, [[0, 2], [3, 4]], false],
    [6, [[7, 9], [10, 15]], false],
    [3, [[1, 2], [4, 4], [6, 7], [9, 10], [31, 32], [33, 34], [35, 36], [38, 38], [40, 42]], false],
    [35, [[1, 2], [4, 4], [6, 7], [9, 10], [31, 32], [33, 34], [36, 36], [38, 38], [40, 42]], false],
    [35, [[1, 2], [4, 4], [6, 7], [9, 10], [31, 32], [33, 34], [35, 35], [38, 38], [40, 42]], true],
  ];
  for (const [find, range, result] of tests) {
    t.equal(inRange(find, range), result, `find ${find} in ${JSON.stringify(range)}`);
  }
  t.end();
});

test('#regexpReplaceCustom', t => {
  t.equal(regexpReplaceCustom('abc!(!!$!#!##!def', /[^a-zA-Z0-9-_.~]+/g, '-', ['$', '(', '##']), 'abc-(-$-##-def');
  t.equal(regexpReplaceCustom('abc!!!$!!!def!!jdj', /[^a-zA-Z0-9-_.~]+/g, '-', ['$', '(', '##']), 'abc-$-def-jdj');
  t.equal(regexpReplaceCustom('abc!!!$!!!def!!jdj', /[^a-zA-Z0-9-_.~]+/g, '-', []), 'abc-def-jdj');
  t.equal(regexpReplaceCustom('abc$def', /[^a-zA-Z0-9-_.~]+/g, '-', ['$']), 'abc$def');
  t.equal(regexpReplaceCustom('abc$def', /[^a-zA-Z0-9-_.~]+/g, '-'), 'abc-def');
  t.end();
});

test('#deepClone', t => {
  const o = { a: 'b' };
  const a = ['a'];
  const d = new Date();
  const r = /a/g;
  const s = 'a';
  const c = { o, a, d, r, s };
  t.notEqual(deepClone(o), o);
  t.deepEqual(deepClone(o), o);
  t.notEqual(deepClone(a), a);
  t.deepEqual(deepClone(a), a);
  t.notEqual(deepClone(d), d);
  t.deepEqual(deepClone(d), d);
  t.notEqual(deepClone(r), r);
  t.deepEqual(deepClone(r), r);
  t.equal(deepClone(s), s);
  t.deepEqual(deepClone(s), s);
  t.notEqual(deepClone(c), c);
  t.deepEqual(deepClone(c), c);
  t.end();
});
