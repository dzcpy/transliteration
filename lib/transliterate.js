import { ucs2decode, fixChineseSpace, dataPath } from './utils';
let codemap = {};
const defaultOptions = {
  unknown: '[?]',
  replace: {},
  ignore: [],
};
/**
 * @param {string} str The string which is being transliterated
 * @param {object} options options
 */
export default function transliteration(str, options) {
  const config = Object.assign({}, defaultOptions, options || {});
  const strArr = ucs2decode(fixChineseSpace(String(str)));
  let strNew = '';
  /* eslint-disable guard-for-in, no-restricted-syntax */
  for (const i in strArr) {
    let ord = strArr[i];
    if (ord > 0xffff) {
      strNew += config.unknown;
      continue;
    }
    const offset = ord >> 8;
    if (typeof codemap[offset] === 'undefined') {
      try {
        codemap[offset] = require(`${dataPath}/x${offset.toString(16)}.json`);
      } catch (e) {
        codemap[offset] = [];
      }
    }
    ord = 0xff & ord;
    const t = codemap[offset][ord];
    if (typeof t === 'undefined' || t === null) {
      strNew += config.unknown;
    } else {
      strNew += codemap[offset][ord];
    }
  }
  /* eslint-enable guard-for-in, no-restricted-syntax */
  return strNew.length > 1 ? strNew.replace(/(^ +?)|( +?$)/g, '') : strNew;
}
transliteration.setCodemap = (customCodemap) => {
  codemap = customCodemap;
};
transliteration.config = (options) => {
  Object.assign(defaultOptions, options);
};
