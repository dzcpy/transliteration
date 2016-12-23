/* global define, window, WorkerGlobalScope, self */
import { transliterate, slugify } from './';
import data from '../../data';

transliterate.setCodemap(data);

const bindGlobals = (globalObj) => {
  globalObj.transl = transliterate;
  globalObj.slugify = slugify;
  globalObj.transl.noConflict = function () {
    const tr = globalObj.transl;
    delete globalObj.transl;
    return tr;
  };
  globalObj.slugify.noConflict = function () {
    const sl = slugify;
    delete globalObj.slugify;
    return sl;
  };
};

// work around for react native bug https://github.com/facebook/react-native/issues/5747
try {
  // AMD support
  if (typeof define === 'function' && define.amd) {
    define('transliterate', () => transliterate);
    define('slugify', () => slugify);
  // Global variables
  } else if (typeof window !== 'undefined' && typeof window.document === 'object') {
    bindGlobals(window);
  // Webworker
  } else if (typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined') {
    bindGlobals(self);
  }
} catch(e) {} // eslint-disable-line

// CommonJS support
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { transliterate, slugify };
}
