'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceStr = undefined;

var _utils = require('./utils');

var codemap = {};
var defaultOptions = {
  unknown: '[?]',
  replace: [],
  replaceAfter: [],
  ignore: []
};
var configOptions = {};

/* istanbul ignore next */
var replaceStr = exports.replaceStr = function replaceStr(str, replace) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = replace[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var item = _step.value;

      if (item[0] instanceof RegExp) {
        var flag = item[0].flags;
        if (!item[0].global) {
          flag += 'g';
          item[0] = new RegExp(item[0].toString().replace(/^\/|\/$/), flag);
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
 * @param {string} str The string which is being transliterated
 * @param {object} options options
 */
/* istanbul ignore next */
var transliterate = function transliterate(str, options) {
  var opt = options ? (0, _utils.mergeOptions)(defaultOptions, options) : (0, _utils.mergeOptions)(defaultOptions, configOptions);
  str = String(str);
  if (opt.ignore instanceof Array && opt.ignore.length > 0) {
    for (var i in opt.ignore) {
      var splitted = str.split(opt.ignore[i]);
      var result = [];
      for (var j in splitted) {
        var ignore = opt.ignore.slice(0);
        ignore.splice(i, 1);
        result.push(transliterate(splitted[j], (0, _utils.mergeOptions)(opt, { ignore: ignore })));
      }
      return result.join(opt.ignore[i]);
    }
  }
  str = replaceStr(str, opt.replace);
  var strArr = (0, _utils.ucs2decode)((0, _utils.fixChineseSpace)(str));
  var strArrNew = [];

  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = strArr[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var ord = _step2.value;

      // These characters are also transliteratable. Will improve it later if needed
      if (ord > 0xffff) {
        strArrNew.push(opt.unknown);
      } else {
        var offset = ord >> 8;
        if (typeof codemap[offset] === 'undefined') {
          try {
            codemap[offset] = require('../../data/x' + offset.toString(16) + '.json');
          } catch (e) {
            codemap[offset] = [];
          }
        }
        ord &= 0xff;
        var t = codemap[offset][ord];
        if (typeof t === 'undefined' || t === null) {
          strArrNew.push(opt.unknown);
        } else {
          strArrNew.push(codemap[offset][ord]);
        }
      }
    }
    // trim spaces at the begining and ending of the string
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

  if (strArrNew.length > 1) {
    opt.replaceAfter.push([/(^ +?)|( +?$)/g, '']);
  }
  var strNew = strArrNew.join('');

  strNew = replaceStr(strNew, opt.replaceAfter);
  return strNew;
};

transliterate.setCodemap = function (customCodemap) {
  codemap = customCodemap || codemap;
  return codemap;
};

transliterate.config = function (options) {
  if (options === undefined) {
    return configOptions;
  }
  configOptions = (0, _utils.mergeOptions)(defaultOptions, options);
  return configOptions;
};

exports.default = transliterate;