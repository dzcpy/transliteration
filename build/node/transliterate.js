'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = transliteration;

var _utils = require('./utils');

var codemap = {};
var defaultOptions = {
  unknown: '[?]',
  replace: {},
  ignore: []
};
/**
 * @param {string} str The string which is being transliterated
 * @param {object} options options
 */
function transliteration(str, options) {
  var config = _extends({}, defaultOptions, options || {});
  var strArr = (0, _utils.ucs2decode)((0, _utils.fixChineseSpace)(String(str)));
  var strNew = '';
  /* eslint-disable guard-for-in, no-restricted-syntax */
  for (var i in strArr) {
    var ord = strArr[i];
    if (ord > 0xffff) {
      strNew += config.unknown;
      continue;
    }
    var offset = ord >> 8;
    if (typeof codemap[offset] === 'undefined') {
      try {
        codemap[offset] = require(_utils.dataPath + '/x' + offset.toString(16) + '.json');
      } catch (e) {
        codemap[offset] = [];
      }
    }
    ord = 0xff & ord;
    var t = codemap[offset][ord];
    if (typeof t === 'undefined' || t === null) {
      strNew += config.unknown;
    } else {
      strNew += codemap[offset][ord];
    }
  }
  /* eslint-enable guard-for-in, no-restricted-syntax */
  return strNew.length > 1 ? strNew.replace(/(^ +?)|( +?$)/g, '') : strNew;
}
transliteration.setCodemap = function (customCodemap) {
  codemap = customCodemap;
};
transliteration.config = function (options) {
  _extends(defaultOptions, options);
};