'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// modified version of ucs2decode with String.prototype.codePointAt polyfill
// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt

var ucs2decode = exports.ucs2decode = function ucs2decode(string) {
  var output = [];
  var counter = 0;
  while (counter < string.length) {
    var value = string.codePointAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < string.length) {
      // high surrogate, and there is a next character
      var extra = string.codePointAt(counter++);
      if ((extra & 0xFC00) === 0xDC00) {
        // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

// add additional space between Chinese and English
var fixChineseSpace = exports.fixChineseSpace = function fixChineseSpace(str) {
  return str.replace(/([^\u4e00-\u9fa5\W])([\u4e00-\u9fa5])/g, '$1 $2');
};

var escapeRegExp = exports.escapeRegExp = function escapeRegExp(str) {
  if (str === null || str === undefined) {
    str = '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

var dataPath = exports.dataPath = /build[\/\\]node[\/\\]?$/.test(__dirname) ? '../../data' : '../data';