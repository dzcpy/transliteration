// Credit: https://github.com/bestiejs/punycode.js/blob/master/LICENSE-MIT.txt
export const ucs2decode = (string) => {
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

// add additional space between Chinese and English
export const fixChineseSpace = str => str.replace(/([^\u4e00-\u9fa5\W])([\u4e00-\u9fa5])/g, '$1 $2');

// Escape regular expression string
export const escapeRegExp = (str) => {
  if (str === null || str === undefined) {
    str = '';
  }
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export const mergeOptions = (defaultOptions, options) => {
  const newOptions = {};
  if (!options || typeof options !== 'object') options = {};
  for (const key in defaultOptions) {
    newOptions[key] = options[key] === undefined ? defaultOptions[key] : options[key];
    if (newOptions[key] instanceof Array) {
      newOptions[key] = newOptions[key].slice(0);
    }
  }
  return newOptions;
};

export const parseCmdEqualOption = (option) => {
  const replaceToken = '__REPLACE_TOKEN__';
  let tmpToken = replaceToken;
  let result;
  while (option.indexOf(tmpToken) > -1) {
    tmpToken += tmpToken;
  }
  // escape for \\=
  if (option.match(/[^\\]\\\\=/)) {
    option = option.replace(/([^\\])\\\\=/g, '$1\\=');
  // escape for \=
  } else if (option.match(/[^\\]\\=/)) {
    option = option.replace(/([^\\])\\=/g, `$1${tmpToken}`);
  }
  result = option.split('=').map(value => value.replace(new RegExp(tmpToken, 'g'), '='));
  if (result.length !== 2) {
    result = false;
  }
  return result;
};
