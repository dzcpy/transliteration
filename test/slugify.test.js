import { expect } from 'chai';
import slugify from '../lib/src/slugify';

const defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: [],
  replaceAfter: [],
  ignore: [],
};

describe('#slugify()', () => {
  const tests = [
    ['\u4F60\u597D, \u4E16\u754C!', {}, 'ni-hao-shi-jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { ignore: ['!', ','] }, 'ni-hao,shi-jie!'],
    ['\u4F60\u597D, \u4E16\u754C!', { replace: [['\u4E16\u754C', '\u672A\u6765']] }, 'ni-hao-wei-lai'],
    ['\u4F60\u597D, \u4E16\u754C!', { replace: [['\u4F60\u597D', 'Hello '], ['\u4E16\u754C', 'World ']] }, 'hello-world'],
    ['\u4F60\u597D, \u4E16\u754C!', { separator: ', ', replace: [['\u4F60\u597D', 'Hola '], ['\u4E16\u754C', 'mundo ']], ignore: ['¡', '!'], lowercase: false }, 'Hola, mundo!'],
  ];
  describe('Generate slugs', () => {
    for (const [str, options, slug] of tests) {
      it(`${str}-->${slug}`, () => expect(slugify(str, options)).to.equal(slug));
    }
  });
});

describe('#slugify.config()', () => {
  describe('Get config', () => {
    it('read current config', () => {
      slugify.config(defaultOptions);
      expect(slugify.config()).to.deep.equal(defaultOptions);
    });
  });
  const tests = [
    ['\u4F60\u597D, \u4E16\u754C!', {}, 'ni-hao-shi-jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { separator: '_' }, 'ni_hao_shi_jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { lowercase: false }, 'Ni-Hao-Shi-Jie'],
    ['\u4F60\u597D, \u4E16\u754C!', { ignore: ['!', ','] }, 'ni-hao,shi-jie!'],
    ['\u4F60\u597D, \u4E16\u754C!', { replace: [['\u4E16\u754C', '\u672A\u6765']] }, 'ni-hao-wei-lai'],
    ['\u4F60\u597D, \u4E16\u754C!', { replace: [['\u4F60\u597D', 'Hello '], ['\u4E16\u754C', 'World ']] }, 'hello-world'],
    ['\u4F60\u597D, \u4E16\u754C!', { separator: ', ', replace: [['\u4F60\u597D', 'Hola '], ['\u4E16\u754C', 'mundo ']], ignore: ['¡', '!'], lowercase: false }, 'Hola, mundo!'],
  ];
  describe('Generate slugs', () => {
    for (const [str, options, slug] of tests) {
      it(`${str}-->${slug}`, () => {
        slugify.config(options);
        expect(slugify(str)).to.equal(slug);
      });
    }
  });
});
