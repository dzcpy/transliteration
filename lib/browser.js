'use strict';
/* global window, define, module, transl, slugify */
(function () {
  var tr = require('./');
  tr.setCodemap(require('./data'));
  // AMD support
  if (typeof define === 'function' && define.amd) {
    define(function () {
      return tr;
    });
  // Global variables
  } else if (window) {
    window.transl = tr.transliterate;
    window.slugify = tr.slugify;
    transl.noConflict = function () {
      delete window.transl;
      return tr.transliterate;
    };
    slugify.noConflict = function () {
      delete window.slugify;
      return tr.slugify;
    };
    // CommonJS support
    if (typeof module !== 'undefined' && module.exports) {
      module.exports = tr;
    }
  }
}());
