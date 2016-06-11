/* global define */
import { transliterate, slugify } from './';
import data from '../../data';
transliterate.setCodemap(data);

// AMD support
if (typeof define === 'function' && define.amd) {
  define('transliterate', () => transliterate);
  define('slugify', () => slugify);
// Global variables
} else if (typeof window !== 'undefined' && typeof window.document === 'object') {
  window.transl = transliterate;
  window.slugify = slugify;
  window.transl.noConflict = function () {
    const tr = window.transl;
    delete window.transl;
    return tr;
  };
  slugify.noConflict = function () {
    const sl = slugify;
    delete window.slugify;
    return sl;
  };
}
// CommonJS support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { transliterate, slugify };
}
