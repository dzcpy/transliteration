'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transliterate = require('./transliterate');

var _transliterate2 = _interopRequireDefault(_transliterate);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Slugify
var defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: [],
  replaceAfter: [],
  ignore: []
};
var configOptions = {};

var slugify = function slugify(str, options) {
  var opt = options ? (0, _utils.mergeOptions)(defaultOptions, options) : (0, _utils.mergeOptions)(defaultOptions, configOptions);
  // remove leading and trailing separators
  var sep = (0, _utils.escapeRegExp)(opt.separator);
  opt.replaceAfter.push([/[^a-zA-Z0-9]+/g, opt.separator], [new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '']);
  var transliterateOptions = { replaceAfter: opt.replaceAfter, replace: opt.replace, ignore: opt.ignore };
  var slug = (0, _transliterate2.default)(str, transliterateOptions);
  if (opt.lowercase) {
    slug = slug.toLowerCase();
  }
  return slug;
};

slugify.config = function (options) {
  if (options === undefined) {
    return configOptions;
  }
  configOptions = (0, _utils.mergeOptions)(defaultOptions, options);
  return configOptions;
};

exports.default = slugify;
module.exports = exports['default'];