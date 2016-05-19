'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transliterate = require('./transliterate');

Object.defineProperty(exports, 'transliterate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_transliterate).default;
  }
});
Object.defineProperty(exports, 'default', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_transliterate).default;
  }
});

var _slugify = require('./slugify');

Object.defineProperty(exports, 'slugify', {
  enumerable: true,
  get: function get() {
    return _slugify.slugify;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }