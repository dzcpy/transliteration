import { ucs2decode, fixChineseSpace, escapeRegExp, mergeOptions } from './utils';

let codemap = {};
const defaultOptions = {
  unknown: '[?]',
  replace: [],
  replaceAfter: [],
  ignore: [],
  trim: true,
};
let configOptions = {};

/* istanbul ignore next */
export const replaceStr = (str, replace) => {
  for (const item of replace) {
    if (item[0] instanceof RegExp) {
      let flag = item[0].flags;
      if (!item[0].global) {
        flag += 'g';
        item[0] = new RegExp(item[0].toString().replace(/^\/|\/$/), flag);
      }
    } else if (typeof item[0] === 'string') {
      item[0] = new RegExp(escapeRegExp(item[0]), 'g');
    }
    if (item[0] instanceof RegExp) {
      str = str.replace(item[0], item[1]);
    }
  }
  return str;
};

/**
 * @param {string} str The string which is being transliterated
 * @param {object} options options
 */
/* istanbul ignore next */
const transliterate = (str, options) => {
  const opt = options ? mergeOptions(defaultOptions, options) : mergeOptions(defaultOptions, configOptions);
  str = String(str);
  if (opt.ignore instanceof Array && opt.ignore.length > 0) {
    for (const i in opt.ignore) {
      const splitted = str.split(opt.ignore[i]);
      const result = [];
      for (const j in splitted) {
        const ignore = opt.ignore.slice(0);
        ignore.splice(i, 1);
        result.push(transliterate(splitted[j], mergeOptions(opt, { ignore, trim: false })));
      }
      return result.join(opt.ignore[i]);
    }
  }
  str = replaceStr(str, opt.replace);
  const strArr = ucs2decode(fixChineseSpace(str));
  const strArrNew = [];

  for (let ord of strArr) {
    // These characters are also transliteratable. Will improve it later if needed
    if (ord > 0xffff) {
      strArrNew.push(opt.unknown);
    } else {
      const offset = ord >> 8;
      if (typeof codemap[offset] === 'undefined') {
        try {
          codemap[offset] = require(`../../data/x${offset.toString(16)}.json`);
        } catch (e) {
          codemap[offset] = [];
        }
      }
      ord &= 0xff;
      const t = codemap[offset][ord];
      if (typeof t === 'undefined' || t === null) {
        strArrNew.push(opt.unknown);
      } else {
        strArrNew.push(codemap[offset][ord]);
      }
    }
  }
  // trim spaces at the begining and ending of the string
  if (opt.trim && strArrNew.length > 1) {
    opt.replaceAfter.push([/(^ +?)|( +?$)/g, '']);
  }
  let strNew = strArrNew.join('');

  strNew = replaceStr(strNew, opt.replaceAfter);
  return strNew;
};

transliterate.setCodemap = (customCodemap) => {
  codemap = customCodemap || codemap;
  return codemap;
};

transliterate.config = (options) => {
  if (options === undefined) {
    return configOptions;
  }
  configOptions = mergeOptions(defaultOptions, options);
  return configOptions;
};

export default transliterate;
