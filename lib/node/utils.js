'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt
var ucs2decode = exports.ucs2decode = function ucs2decode(string) {
  var output = [];
  var counter = 0;
  while (counter < string.length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < string.length) {
      // high surrogate, and there is a next character
      var extra = string.charCodeAt(counter++);
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

// add additional space between Chinese and English.
var fixChineseSpace = exports.fixChineseSpace = function fixChineseSpace(str) {
  return str.replace(/([^\u4e00-\u9fa5\W])([\u4e00-\u9fa5])/g, '$1 $2');
};

// Escape regular expression string
var escapeRegExp = exports.escapeRegExp = function escapeRegExp(str) {
  if (str === null || str === undefined) {
    str = '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

/**
 * Merge configuration options. Use deep merge if option is an array.
 */
var mergeOptions = exports.mergeOptions = function mergeOptions(defaultOptions, options) {
  var result = {};
  if (!options) options = {};
  for (var key in defaultOptions) {
    result[key] = options[key] === undefined ? defaultOptions[key] : options[key];
    if (result[key] instanceof Array) {
      result[key] = result[key].slice(0);
    }
    // convert object version of the 'replace' option into array version
    if (key === 'replace' && _typeof(result[key]) === 'object' && !(result[key] instanceof Array)) {
      var replaceArr = [];
      for (var source in result.replace) {
        replaceArr.push([source, result.replace[source]]);
      }
      result.replace = replaceArr;
    }
  }
  return result;
};

var parseCmdEqualOption = exports.parseCmdEqualOption = function parseCmdEqualOption(option) {
  var replaceToken = '__REPLACE_TOKEN__';
  var tmpToken = replaceToken;
  var result = void 0;
  while (option.indexOf(tmpToken) > -1) {
    tmpToken += tmpToken;
  }
  // escape for \\=
  if (option.match(/[^\\]\\\\=/)) {
    option = option.replace(/([^\\])\\\\=/g, '$1\\=');
    // escape for \=
  } else if (option.match(/[^\\]\\=/)) {
    option = option.replace(/([^\\])\\=/g, '$1' + tmpToken);
  }
  result = option.split('=').map(function (value) {
    return value.replace(new RegExp(tmpToken, 'g'), '=');
  });
  if (result.length !== 2) {
    result = false;
  }
  return result;
};