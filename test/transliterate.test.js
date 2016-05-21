/**
 * Tests are taken from Text-Unidecode-0.04/test.pl
 *
 * @see <http://search.cpan.org/~sburke/Text-Unidecode-0.04/lib/Text/Unidecode.pm>
 */

import { default as tr, replaceStr } from '../lib/src/transliterate';
import { expect } from 'chai';

const defaultOptions = {
  unknown: '[?]',
  replace: [],
  replaceAfter: [],
  ignore: [],
};

describe('#transliterate()', () => {
  describe('- Purity tests', () => {
    const tests = [];
    for (let i = 1; tests.length < 127; tests.push(String.fromCharCode(i++)));

    tests.forEach(test => {
      it(`${test.charCodeAt(0).toString(16)} ${test}`, () => {
        expect(tr(test)).to.equal(test);
      });
    });
  });

  describe('- Basic string tests', () => {
    const tests = [
      '',
      1 / 10,
      'I like pie.',
      '\n',
      '\r\n',
      'I like pie.\n',
    ];

    tests.forEach(test => {
      it(test, () => expect(tr(test.toString())).to.equal(test.toString()));
    });
  });

  describe('- Complex tests', () => {
    const tests = [
      ['\u00C6neid', 'AEneid'],
      ['\u00E9tude', 'etude'],
      ['\u5317\u4EB0', 'Bei Jing'],
      //  Chinese
      ['\u1515\u14c7\u14c7', 'shanana'],
      //  Canadian syllabics
      ['\u13d4\u13b5\u13c6', 'taliqua'],
      //  Cherokee
      ['\u0726\u071b\u073d\u0710\u073a', 'ptu\'i'],
      //  Syriac
      ['\u0905\u092d\u093f\u091c\u0940\u0924', 'abhijiit'],
      //  Devanagari
      ['\u0985\u09ad\u09bf\u099c\u09c0\u09a4', 'abhijiit'],
      //  Bengali
      ['\u0d05\u0d2d\u0d3f\u0d1c\u0d40\u0d24', 'abhijiit'],
      //  Malayalaam
      ['\u0d2e\u0d32\u0d2f\u0d3e\u0d32\u0d2e\u0d4d', 'mlyaalm'],
      //  the Malayaalam word for 'Malayaalam'
      //  Yes, if we were doing it right, that'd be 'malayaalam', not 'mlyaalm'
      ['\u3052\u3093\u307e\u3044\u8336', 'genmaiCha'],
      //  Japanese, astonishingly unmangled.
      [`\u0800\u1400${unescape('%uD840%uDD00')}`, '[?][?][?]'],
      // Unknown characters
    ];

    for (const [str, result] of tests) {
      it(`${str}-->${result}`, () => {
        expect(tr(str)).to.equal(result);
      });
    }
  });

  describe('- With ignore option', () => {
    const tests = [
      ['\u00C6neid', ['\u00C6'], '\u00C6neid'],
      ['\u4F60\u597D\uFF0C\u4E16\u754C\uFF01', ['\uFF0C', '\uFF01'], 'Ni Hao\uFF0CShi Jie\uFF01'],
      ['\u4F60\u597D\uFF0C\u4E16\u754C\uFF01', ['\u4F60\u597D', '\uFF01'], '\u4F60\u597D,Shi Jie\uFF01'],
    ];
    for (const [str, ignore, result] of tests) {
      it(`${str}-->${result}`, () => {
        expect(tr(str, { ignore })).to.equal(result);
      });
    }
  });

  describe('- With replace option', () => {
    const tests = [
      ['\u4F60\u597D\uFF0C\u4E16\u754C\uFF01', [['\u4F60\u597D', 'Hola']], 'Hola,Shi Jie !'],
    ];
    for (const [str, replace, result] of tests) {
      it(`${str}-->${result}`, () => {
        expect(tr(str, { replace })).to.equal(result);
      });
    }
  });
});

describe('#replaceStr()', () => {
  const tests = [
    ['abbc', [['a', 'aa'], [/b+/g, 'B']], 'aaBc'],
    ['abbc', [[false, '']], 'abbc'],
  ];
  for (const [str, replace, result] of tests) {
    it(`${str}->${result}`, () => {
      expect(replaceStr(str, replace)).to.equal(result);
    });
  }
});


describe('#transliterage.config()', () => {
  it('read current config', () => {
    tr.config(defaultOptions);
    expect(tr.config()).to.deep.equal(defaultOptions);
  });
});


describe('#transliterage.setCodemap()', () => {
  const codemap = { 0: { 97: 'A', 98: 'B', 99: 'C' } };
  it('set custom codemap', () => {
    tr.setCodemap(codemap);
    expect(tr.setCodemap(codemap)).to.equal(codemap);
  });
  it('read current custom codemap', () => {
    expect(tr.setCodemap()).to.deep.equal(codemap);
  });
  it('transliterate with custom codemap', () => {
    expect(tr('abc')).to.equal('ABC');
  });
});
