/* global describe, it, before, beforeEach, after, afterEach */

import slugify from '../lib/slugify';
import { expect } from 'chai';

describe('#slugify()', () => {
  const tests = [
    ['你好', 'ni-hao', 'Ni-Hao'],
  ];
  describe('Generate slugs', () => {
    for (const [str, slug] of tests) {
      it(`${str}-->${slug}`, () => expect(slugify(str)).to.equal(slug));
    }
  });
  describe('Generate slugs with option lowercase = false', () => {
    for (const [str, , slug] of tests) {
      it(`${str}-->${slug}`, () => expect(slugify(str, { lowercase: false })).to.equal(slug));
    }
  });
});

describe('#slugify.config()', () => {
  it('get default options', () => {
    const defaultOptions = {
      lowercase: true,
      separator: '-',
      replace: {},
      ignore: [],
    };
    expect(slugify.config()).to.deep.equal(defaultOptions);
  });
});
