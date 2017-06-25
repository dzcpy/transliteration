'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceStr = undefined;

var _utils = require('./utils');

var _charmap = require('../../data/charmap.json');

var _charmap2 = _interopRequireDefault(_charmap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var charmap = {};
var defaultOptions = {
  unknown: '[?]',
  replace: [],
  replaceAfter: [],
  ignore: [],
  trim: true
};
var configOptions = {};

/* istanbul ignore next */
var replaceStr = exports.replaceStr = function replaceStr(source, replace) {
  var str = source;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = replace[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item[0] instanceof RegExp) {
        if (!item[0].global) {
          item[0] = new RegExp(item[0].toString().replace(/^\/|\/$/), item[0].flags + 'g');
        }
      } else if (typeof item[0] === 'string') {
        item[0] = new RegExp((0, _utils.escapeRegExp)(item[0]), 'g');
      }
      if (item[0] instanceof RegExp) {
        str = str.replace(item[0], item[1]);
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

  return str;
};

/**
 * @param {string} sourceStr The string which is being transliterated
 * @param {object} options options
 */
/* istanbul ignore next */
var transliterate = function transliterate(sourceStr, options) {
  var opt = options ? (0, _utils.mergeOptions)(defaultOptions, options) : (0, _utils.mergeOptions)(defaultOptions, configOptions);
  var str = String(sourceStr);
  var i = void 0,
      j = void 0,
      splitted = void 0,
      result = void 0,
      ignore = void 0,
      ord = void 0;
  if (opt.ignore instanceof Array && opt.ignore.length > 0) {
    for (i in opt.ignore) {
      splitted = str.split(opt.ignore[i]);
      result = [];
      for (j in splitted) {
        ignore = opt.ignore.slice(0);
        ignore.splice(i, 1);
        result.push(transliterate(splitted[j], (0, _utils.mergeOptions)(opt, { ignore: ignore, trim: false })));
      }
      return result.join(opt.ignore[i]);
    }
  }
  str = replaceStr(str, opt.replace);
  str = (0, _utils.fixChineseSpace)(str);
  var strArr = (0, _utils.ucs2decode)(str);
  var strArrNew = [];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = strArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      ord = _step2.value;

      // These characters are also transliteratable. Will improve it later if needed
      if (ord > 0xffff) {
        strArrNew.push(opt.unknown);
      } else {
        var offset = ord >> 8;
        if (typeof charmap[offset] === 'undefined') {
          charmap[offset] = _charmap2.default[offset] || [];
        }
        ord &= 0xff;
        var text = charmap[offset][ord];
        if (typeof text === 'undefined' || text === null) {
          strArrNew.push(opt.unknown);
        } else {
          strArrNew.push(charmap[offset][ord]);
        }
      }
    }
    // trim spaces at the beginning and ending of the string
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  if (opt.trim && strArrNew.length > 1) {
    opt.replaceAfter.push([/(^ +?)|( +?$)/g, '']);
  }
  var strNew = strArrNew.join('');

  strNew = replaceStr(strNew, opt.replaceAfter);
  return strNew;
};

transliterate.setCharmap = function (customCharmap) {
  charmap = customCharmap || charmap;
  return charmap;
};

transliterate.config = function (options) {
  if (options === undefined) {
    return configOptions;
  }
  configOptions = (0, _utils.mergeOptions)(defaultOptions, options);
  return configOptions;
};

exports.default = transliterate;