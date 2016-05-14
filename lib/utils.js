// modified version of ucs2decode with String.prototype.codePointAt polyfill
// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt

export const ucs2decode = string => {
  const output = [];
  let counter = 0;
  while (counter < string.length) {
    const value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < string.length) {
      // high surrogate, and there is a next character
      const extra = string.charCodeAt(counter++);
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

// if (!String.prototype.codePointAt) {
//   const defineProperty = (() => {
//     // IE 8 only supports `Object.defineProperty` on DOM elements
//     let result;
//     try {
//       const object = {};
//       result = Object.defineProperty(object, object, object) && Object.defineProperty;
//     } catch (e) {}
//     return result;
//   })();
//   var codePointAt = function(position) {
//     if (this == null) {
//       throw TypeError();
//     }
//     var string = String(this);
//     var size = string.length;
//     // `ToInteger`
//     var index = position ? Number(position) : 0;
//     if (index != index) { // better `isNaN`
//       index = 0;
//     }
//     // Account for out-of-bounds indices:
//     if (index < 0 || index >= size) {
//       return undefined;
//     }
//     // Get the first code unit
//     var first = string.charCodeAt(index);
//     var second;
//     if ( // check if it’s the start of a surrogate pair
//       first >= 0xD800 && first <= 0xDBFF && // high surrogate
//       size > index + 1 // there is a next code unit
//     ) {
//       second = string.charCodeAt(index + 1);
//       if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
//         // https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
//         return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
//       }
//     }
//     return first;
//   };
//   if (defineProperty) {
//     defineProperty(String.prototype, 'codePointAt', {
//       value: codePointAt,
//       configurable: true,
//       writable: true,
//     });
//   } else {
//     String.prototype.codePointAt = codePointAt;
//   }
// }

// add additional space between Chinese and English
export const fixChineseSpace = str => str.replace(/([^\u4e00-\u9fa5\W])([\u4e00-\u9fa5])/g, '$1 $2');

export const escapeRegExp = str => {
  if (str === null || str === undefined) {
    str = '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export const dataPath = /build[\/\\]node[\/\\]?$/.test(__dirname) ? '../../data' : '../data';
