var punycode = require('punycode');

var transliteration = {
  transliterate: function(str, unknown) {
    var codemap = {};
    unknown = unknown || '?';
    str = punycode.ucs2.decode(str);
    strNew = '';
    Array.prototype.forEach.call(str, function(ord) {
      if(ord > 0xffff) {
        strNew += unknown;
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
      var str = codemap[bank][ord];
      if(str === null) str = unknown;
      strNew += str;
    });
    return strNew;
  },
  slugify: function(str, options) {
    var defaultOptions = {
      lowercase: true,
      separator: '-',
    }
    options = options || {};
    Array.prototype.forEach.call(Object.getOwnPropertyNames(defaultOptions), function(prop) {
      if(typeof options[prop] === 'undefined') options[prop] = defaultOptions[prop];
    });
    if(typeof lowercase === 'undefined') lowercase = true;
    var slug = transliteration.transliterate(str).replace(/[^a-zA-Z0-9]+/g, options.separator);
    if(options.lowercase) {
      slug = slug.toLowerCase();
    }
    // remove leading and trailing separator
    if(slug[0] == options.separator) slug = slug.substr(1);
    if(slug[slug.length -1] == options.separator) slug = slug.substr(0, slug.length -1);
    return slug;
  }
}
module.exports = transliteration;