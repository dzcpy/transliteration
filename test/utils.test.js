import * as utils from '../lib/src/utils';
import { expect } from 'chai';

describe('#ucs2decode()', () => {
  const data = [
    // Every Unicode symbol is tested separately. These are just the extra
    // tests for symbol combinations:
    {
      description: 'Consecutive astral symbols',
      decoded: [127829, 119808, 119558, 119638],
      encoded: '\uD83C\uDF55\uD835\uDC00\uD834\uDF06\uD834\uDF56',
    },
    {
      description: 'U+D800 (high surrogate) followed by non-surrogates',
      decoded: [55296, 97, 98],
      encoded: '\uD800ab',
    },
    {
      description: 'U+DC00 (low surrogate) followed by non-surrogates',
      decoded: [56320, 97, 98],
      encoded: '\uDC00ab',
    },
    {
      description: 'High surrogate followed by another high surrogate',
      decoded: [0xD800, 0xD800],
      encoded: '\uD800\uD800',
    },
    {
      description: 'Unmatched high surrogate, followed by a surrogate pair, followed by an unmatched high surrogate',
      decoded: [0xD800, 0x1D306, 0xD800],
      encoded: '\uD800\uD834\uDF06\uD800',
    },
    {
      description: 'Low surrogate followed by another low surrogate',
      decoded: [0xDC00, 0xDC00],
      encoded: '\uDC00\uDC00',
    },
    {
      description: 'Unmatched low surrogate, followed by a surrogate pair, followed by an unmatched low surrogate',
      decoded: [0xDC00, 0x1D306, 0xDC00],
      encoded: '\uDC00\uD834\uDF06\uDC00',
    },
    {
      description: 'High surrogate followed by a low surrogate',
      decoded: [0x10400],
      encoded: '\uD801\uDC00',
    },
  ];
  describe('Return ucs2 code array of a string', () => {
    data.forEach(item =>
      it(item.description, () => expect(utils.ucs2decode(item.encoded)).to.deep.equal(item.decoded))
    );
  });
});

describe('#escapeRegex()', () => {
  const escaped = '\\^\\$\\.\\*\\+\\?\\(\\)\\[\\]\\{\\}\\|\\\\';
  const unescaped = '^$.*+?()[]{}|\\';

  it('should escape values', () => {
    expect(utils.escapeRegExp(unescaped + unescaped)).to.equal(escaped + escaped);
  });

  it('should handle strings with nothing to escape', () => {
    expect(utils.escapeRegExp('abc')).to.equal('abc');
  });

  it('should return an empty string for empty values', () => {
    /* eslint-disable no-sparse-arrays,no-confusing-arrow */
    const values = [, null, undefined, ''];
    const expected = values.map(() => '');
    const actual = values.map((value, index) =>
    /* eslint-enable no-sparse-arrays,no-confusing-arrow */
      index ? utils.escapeRegExp(value) : utils.escapeRegExp()
    );

    expect(expected).to.deep.equal(actual);
  });
});

describe('#parseCmdEqualOption', () => {
  it('a=b', () => {
    expect(utils.parseCmdEqualOption('a=b')).to.deep.equal(['a', 'b']);
  });
  it('a\\==b', () => {
    expect(utils.parseCmdEqualOption('a\\==b')).to.deep.equal(['a=', 'b']);
  });
  it('a\\\\=b', () => {
    expect(utils.parseCmdEqualOption('a\\\\=b')).to.deep.equal(['a\\', 'b']);
  });
  it('a==b', () => {
    expect(utils.parseCmdEqualOption('a==b')).to.equal(false);
  });
  it('a__REPLACE_TOKEN__=b', () => {
    expect(utils.parseCmdEqualOption('a__REPLACE_TOKEN__=b')).to.deep.equal(['a__REPLACE_TOKEN__', 'b']);
  });
});

describe('#mergeOptions', () => {
  it('extrame case with option="abc"', () => {
    const opt = { a: 'b' };
    expect(utils.mergeOptions(opt, 'abc')).to.deep.equal(opt);
  });
});
