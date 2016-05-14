'use strict';
var transliterate = require('./transliterate.js');
// Slugify
var defaultOptions = {
  lowercase: true,
  separator: '-'
};

var slugify = function (str, options) {
  var config = options;
  var slug;
  var sep;
  if (!options) {
    config = defaultOptions;
  } else {
    defaultOptions = options;
  }
  slug = transliterate(str).replace(/[^a-zA-Z0-9]+/g, config.separator);
  if (config.lowercase) {
    slug = slug.toLowerCase();
  }
  // remove leading and trailing separators
  sep = config.separator.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  slug = slug.replace(new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '');
  return slug;
};

slugify.config = function (options) {
  Object.assign(defaultOptions, options);
};
module.exports = slugify;
