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

var slugify = function slugify(str, options) {
  options = (0, _utils.mergeOptions)(defaultOptions, options);
  // remove leading and trailing separators
  var sep = (0, _utils.escapeRegExp)(options.separator);
  options.replaceAfter.push([/[^a-zA-Z0-9]+/g, options.separator], [new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '']);
  var transliterateOptions = { replaceAfter: options.replaceAfter, replace: options.replace, ignore: options.ignore };
  var slug = (0, _transliterate2.default)(str, transliterateOptions);
  if (options.lowercase) {
    slug = slug.toLowerCase();
  }
  return slug;
};

slugify.config = function (options) {
  defaultOptions = (0, _utils.mergeOptions)(defaultOptions, options);
  return defaultOptions;
};

exports.default = slugify;