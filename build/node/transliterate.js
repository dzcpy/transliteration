'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = transliterate;

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
function transliterate(str, options) {
  var config = _extends({}, defaultOptions, options || {});
  var strArr = (0, _utils.ucs2decode)((0, _utils.fixChineseSpace)(String(str)));
  var strNew = '';

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = strArr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var ord = _step.value;

      // These characters are also transliteratable. Will improve it later if needed
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
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return strNew.length > 1 ? strNew.replace(/(^ +?)|( +?$)/g, '') : strNew;
}

transliterate.setCodemap = function (customCodemap) {
  codemap = customCodemap || codemap;
  return codemap;
};

transliterate.config = function () {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return _extends(defaultOptions, options);
};