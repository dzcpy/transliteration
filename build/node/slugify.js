'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = slugify;

var _transliterate = require('./transliterate');

var _transliterate2 = _interopRequireDefault(_transliterate);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Slugify
var defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: {},
  ignore: []
};

function slugify(str, options) {
  var config = _extends({}, defaultOptions, options || {});
  // remove leading and trailing separators
  var sep = (0, _utils.escapeRegexp)(config.separator);
  var slug = (0, _transliterate2.default)(str).replace(/[^a-zA-Z0-9]+/g, config.separator);
  if (config.lowercase) {
    slug = slug.toLowerCase();
  }

  slug = slug.replace(new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '');
  return slug;
}

slugify.config = function (options) {
  _extends(defaultOptions, options);
};
module.exports = slugify;