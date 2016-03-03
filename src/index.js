// This file should be used in the browser
(function () {
    var Transliteration = require('../src/transliteration');
    // AMD support
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Transliteration;
        });
    }
    // CommonJS support
    else if (typeof module !== 'undefined' && module.exports) {
        module.exports = Transliteration;
    }
    // Global object
    else if (window) {
        window.TR = window.Transliteration = Transliteration;
        Transliteration.noConflict = function () {
            unset(window.TR, window.Transliteration);
            return Transliteration;
        };
    }
})();
