'use strict';
var ucs2decode = require('./utils').ucs2decode;
var codemap = {};
var defaultOptions = {
  unknown: '[?]'
};
var transliteration = function (str, options) {
  var config = options || defaultOptions;
  var strArr = ucs2decode(
    String(str)
      // add additional space between Chinese and English
      .replace(/([^\u4e00-\u9fa5\W])([\u4e00-\u9fa5])/g, '$1 $2')
    );
  var ord;
  var ascii;
  var strNew = '';
  var offset;
  for (var i = 0; i < strArr.length; i++) {
    ord = strArr[i];
    if (ord > 0xffff) {
      strNew += config.unknown;
      continue;
    }
    offset = ord >> 8;
    if (typeof codemap[offset] === 'undefined') {
      try {
        codemap[offset] = require('./data/x' + offset.toString(16) + '.json');
      } catch (e) {
        codemap[offset] = [];
        for (var j = 0; j < 256; j++) {
          codemap[offset].push(config.unknown);
        }
      }
    }
    ord = 0xff & ord;
    ascii = codemap[offset][ord];
    if (ascii === null) ascii = config.unknown;
    strNew += ascii;
  }
  return strNew.length > 1 ? strNew.replace(/(^ +?)|( +?$)/g, '') : strNew;
};
transliteration.setCodemap = function (customCodemap) {
  codemap = customCodemap;
};
transliteration.config = function (options) {
  Object.assign(defaultOptions, options);
};
module.exports = transliteration;
