/**
 * Tests are taken from Text-Unidecode-0.04/test.pl
 *
 * @see <http://search.cpan.org/~sburke/Text-Unidecode-0.04/lib/Text/Unidecode.pm>
 */

/* global describe, it, before, beforeEach, after, afterEach */

import { transliterate as tr } from '../lib';
import { expect } from 'chai';

describe('#transliteration()', () => {
  describe('- Purity tests', () => {
    const tests = [...Array(127).keys()].map(i => String.fromCharCode(++i));

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
});

describe('#transliterage.config()', () => {
  it('get default options', () => {
    const defaultOptions = {
      unknown: '[?]',
      replace: {},
      ignore: [],
    };
    expect(tr.config()).to.deep.equal(defaultOptions);
  });
});


describe('#transliterage.setCodemap()', () => {
  it('set codemap', () => {
    const codemap = { t: 't' };
    expect(tr.setCodemap(codemap)).to.equal(codemap);
  });
});
