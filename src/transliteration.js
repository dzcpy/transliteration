'use strict';
var ucs2decode = require('punycode').ucs2.decode,
    codemap = require('../src/codemap'),
    Transliteration = function (str, unknown) {
        unknown = unknown || '?';
        str = ucs2decode(str || '');
        var ord, ascii, strNew = '', i, x;
        for (i in str) {
            ord = str[i];
            if (ord > 0xffff) {
                strNew += unknown;
                continue;
            }
            var bank = ord >> 8;
            if (typeof codemap[bank] === 'undefined') {
                codemap[bank] = [];
                for (x = 0; x < 256; x++) {
                    codemap[bank].push(unknown);
                }
            }
            ord = 0xff & ord;
            ascii = codemap[bank][ord];
            if (ascii === null) {
                ascii = unknown;
            }
            strNew += ascii;
        }
        return strNew.replace(/\s+$/, '');
    },
    Slugify = function (str, options) {
        options = options || {};
        var defaultOptions = {
            lowercase: true,
            separator: '-'
        };
        for (var prop in defaultOptions) {
            if (typeof options[prop] === 'undefined') {
                options[prop] = defaultOptions[prop];
            }
        }
        var slug = new Transliteration(str).replace(/[^a-zA-Z0-9]+/g, options.separator);
        if (options.lowercase) {
            slug = slug.toLowerCase();
        }
        // remove leading and trailing separators
        var sep = options.separator.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
        slug = slug.replace(new RegExp('^(' + sep + ')+|(' + sep + ')+$', 'g'), '');
        return slug;
    };

Transliteration.transliterate = Transliteration;
Transliteration.slugify = Slugify;
Transliteration.codemap = codemap;
module.exports = Transliteration;
