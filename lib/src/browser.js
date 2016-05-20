/* global define */
import { transliterate as transl, slugify } from './';
import data from '../../data';
transl.setCodemap(data);

// AMD support
if (typeof define === 'function' && define.amd) {
  define('transliterate', () => transl);
  define('slugify', () => slugify);
// Global variables
} else if (typeof window !== 'undefined' && typeof window.document === 'object') {
  window.transl = transl;
  window.slugify = slugify;
  transl.noConflict = function () {
    const tr = transl;
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
  module.exports = transl;
}
