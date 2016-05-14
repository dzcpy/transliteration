'use strict';
var transliteration = require('./transliterate.js');
transliteration.transliterate = transliteration;
transliteration.slugify = require('./slugify.js');
module.exports = transliteration;
