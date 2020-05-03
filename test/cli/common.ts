import test from 'tape';
import {
  parseReplaceOptionItem,
  substituteCLIReplace,
} from '../../src/cli/common';

test('#parseReplaceOptionItem', (t) => {
  t.deepEqual(parseReplaceOptionItem('a=b'), ['a', 'b'], 'a=b');
  t.deepEqual(parseReplaceOptionItem('a\\==b'), ['a=', 'b'], 'a\\==b');
  t.deepEqual(parseReplaceOptionItem('a\\\\=b'), ['a\\', 'b'], 'a\\\\=b');
  t.deepEqual(parseReplaceOptionItem('a==b'), ['a', '=b'], 'a==b');
  t.deepEqual(
    parseReplaceOptionItem(`a${substituteCLIReplace}=b`),
    [`a${substituteCLIReplace}`, 'b'],
    `a${substituteCLIReplace}=b`,
  );
  t.end();
});
