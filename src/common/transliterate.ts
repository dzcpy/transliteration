import { IntervalArray, OptionReplaceArray, OptionReplaceCombined, OptionReplaceObject, OptionsTransliterate } from '../types';

import { charmap, Charmap } from '../../data/charmap';
import { deepClone, escapeRegExp, findStrOccurrences, inRange, isChinese, regexpReplaceCustom } from './utils';

export const defaultOptions: OptionsTransliterate = {
  ignore: [],
  replace: [],
  replaceAfter: [],
  trim: false,
  unknown: '',
};

export class Transliterate {
  get options(): OptionsTransliterate {
    return deepClone({ ...defaultOptions, ...this.confOptions });
  }

  constructor(
    protected confOptions: OptionsTransliterate = deepClone(defaultOptions),
    protected map: Charmap = charmap
  ) {}

  /**
   * Set default config
   * @param options
   */
  public config(options?: OptionsTransliterate, reset = false): OptionsTransliterate {
    if (reset) {
      this.confOptions = {};
    }
    if (options && typeof options === 'object') {
      this.confOptions = deepClone(options);
    }
    return this.confOptions;
  }

  /**
   * Replace the source string using the code map
   * @param str
   * @param ignoreRanges
   * @param map
   * @param unknown
   */
  public codeMapReplace(str: string, ignoreRanges: IntervalArray): string {
    let index = 0;
    let result = '';
    for (const char of str) {
      let s: string;
      switch (true) {
        // current character is in ignored list
        case inRange(index, ignoreRanges):
        // could be UTF-16 with high and low surrogates
        case char.length === 2 && inRange(index + 1, ignoreRanges):
          s = char;
          break;
        default:
          s = this.map[char] || this.options.unknown!;
      }
      // fix Chinese spacing issue
      if (isChinese(char) && this.map[char]) {
        if (str[index - 1] && !isChinese(s) && !/\s/.test(result[result.length - 1])) {
          s = ' ' + s;
        }
      }
      result += s;
      index += char.length;
    }
    return result;
  }

  /**
   * Convert the object version of the 'replace' option into tuple array one
   * @param option replace option to be either an object or tuple array
   * @return return the paired array version of replace option
   */
  public formatReplaceOption = (option: OptionReplaceCombined): OptionReplaceArray => {
    if (option instanceof Array) {
      // return a new copy of the array
      return deepClone(option);
    }
    // convert object option to array one
    const replaceArr: OptionReplaceArray = [];
    for (const key of Object.keys(option as OptionReplaceObject)) {
      replaceArr.push([key, option[key]]);
    }
    return replaceArr;
  }

  /**
   * Search and replace a list of strings(regexps) and return the result string
   * @param source Source string
   * @param searches Search-replace string(regexp) pairs
   */
  public replaceString(source: string, searches: OptionReplaceArray, ignore: string[] = []): string {
    const clonedSearches = deepClone(searches);
    let result = source;
    for (const item of clonedSearches) {
      switch (true) {
        case item[0] instanceof RegExp:
          item[0] = RegExp(item[0].source, `${item[0].flags.replace('g', '')}g`);
          break;
        case (typeof item[0] === 'string') && item[0].length > 0:
          item[0] = RegExp(escapeRegExp(item[0]), 'g');
          break;
        default:
          item[0] = /[^\s\S]/; // Prevent ReDos attack
      }
      result = regexpReplaceCustom(result, item[0], item[1], ignore);
    }
    return result;
  }

  /**
   * Set charmap data
   * @param {Charmap} [data]
   * @param {boolean} [reset=false]
   * @memberof Transliterate
   */
  public setData(data?: Charmap, reset = false): Charmap {
    if (reset) {
      this.map = deepClone(charmap);
    }
    if (data && typeof data === 'object' && Object.keys(data).length) {
      this.map = deepClone(this.map);
      for (const from of Object.keys(data)) {
        if (from.length < 3 && from <= '\udbff\udfff') {
          this.map[from] = data[from];
        }
      }
    }
    return this.map;
  }

  /**
   * Main transliterate function
   * @param source The string which is being transliterated
   * @param options Options object
   */
  public transliterate(source: string, options?: OptionsTransliterate): string {
    options = typeof options === 'object' ? options : {};
    const opt: OptionsTransliterate = deepClone({ ...this.options, ...options});

    // force convert to string
    let str = String(source);

    const replaceOption: OptionReplaceArray = this.formatReplaceOption(opt.replace as OptionReplaceCombined);
    if (replaceOption.length) {
      str = this.replaceString(str, replaceOption, opt.ignore);
    }

    // ignore
    let ignoreRanges: IntervalArray = [];
    if (opt.ignore && opt.ignore.length > 0) {
      ignoreRanges = findStrOccurrences(source, opt.ignore);
    }

    str = this.codeMapReplace(str, ignoreRanges);

    // trim spaces at the beginning and ending of the string
    if (opt.trim) {
      str = str.trim();
    }

    const replaceAfterOption: OptionReplaceArray = this.formatReplaceOption(opt.replaceAfter as OptionReplaceCombined);
    if (replaceAfterOption.length) {
      str = this.replaceString(str, replaceAfterOption);
    }
    return str;
  }
}
