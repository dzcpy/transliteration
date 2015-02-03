// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt
var ucs2decode = function(string) {
  var output = [],
      counter = 0,
      length = string.length,
      value,
      extra;
  while (counter < length) {
    value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // high surrogate, and there is a next character
      extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // low surrogate
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
}

var transliteration = function(str, unknown) {
  var codemap = {}, ord, ascii;
  unknown = unknown || '?';
  str = ucs2decode(str);
  strNew = '';
  for(i in str) {
    ord = str[i];
    if(ord > 0xffff) {
      strNew += unknown;
      continue;
    }
    var bank = ord >> 8;
    if(typeof codemap[bank] === 'undefined') {
      var filename = '../data/x' + bank.toString(16) + '.js';
      try {
        codemap[bank] = require(filename);
      }
      catch(e) {
        codemap[bank] = [];
        for(var i = 0; i < 256; i++) {
          codemap[bank].push(unknown);
        }
      }
    }
    ord = 0xff & ord;
    ascii = codemap[bank][ord];
    if(ascii === null) ascii = unknown;
    strNew += ascii;
  };
  return strNew.replace(/\s+$/, '');
};
transliteration.transliterate = transliteration;
transliteration.slugify = function(str, options) {
  var defaultOptions = {
    lowercase: true,
    separator: '-'
  };
  options = options || {};
  for(prop in defaultOptions) {
    if(typeof options[prop] === 'undefined') options[prop] = defaultOptions[prop];
  }
  var slug = transliteration.transliterate(str).replace(/[^a-zA-Z0-9]+/g, options.separator);
  if(options.lowercase) {
    slug = slug.toLowerCase();
  }
  // remove leading and trailing separators
  var sep = options.separator.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  slug = slug.replace(new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '');
  return slug;
};
module.exports = transliteration;