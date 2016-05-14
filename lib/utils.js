'use strict';
// ucs2decode
// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  var value;
  var extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) === 0xDC00) { // low surrogate
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // unmatched surrogate; only append this code unit, in case the next
        // code unit is the high surrogate of a surrogate pair
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

// object.assign polyfill
// Credit: https://github.com/sindresorhus/object-assign/blob/master/license
if (!Object.assign) {
  /* eslint-disable no-unused-vars */
  Object.assign = function (target, source) {
    var from;
    var to = Object(target);
    var symbols;
    var s;
    var key;
    var i;

    for (s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);

      for (key in from) {
        if (Object.prototype.hasOwnProperty.call(from, key)) {
          to[key] = from[key];
        }
      }

      if (Object.getOwnPropertySymbols) {
        symbols = Object.getOwnPropertySymbols(from);
        for (i = 0; i < symbols.length; i++) {
          if (Object.prototype.propertyIsEnumerable.call(from, symbols[i])) {
            to[symbols[i]] = from[symbols[i]];
          }
        }
      }
    }

    return to;
  };
}
module.exports = {};
module.exports.ucs2decode = ucs2decode;
