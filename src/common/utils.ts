import { IntervalArray } from '../types';

/**
 * Escape regular expression string
 * @see https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex/6969486#6969486
 */
export function escapeRegExp(str?: string): string {
  return (str || '').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export function isChinese(char: string): boolean {
  const c = char.charCodeAt(0);
  return c >= 0x4e00 && c <= 0x9fff || c >= 0xf900 && c <= 0xfaff;
};

/**
 * Deep clone a variable
 * @param obj Object to clone
 * @returns The cloned object
 */
export function deepClone(obj: any): any {
  switch (true) {
    case obj instanceof Array:
      const clonedArr: any[] = [];
      for (let i = 0; i < obj.length; i++) {
        clonedArr[i] = deepClone(obj[i]);
      }
      return clonedArr;
    // case obj instanceof Date:
    //   return new Date(obj.valueOf());
    case obj instanceof RegExp:
      return new RegExp(obj.source, obj.flags);
    case obj instanceof Object:
      const clonedObj: any = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    default:
      return obj;
  }
};

/**
 * Find all occurrences of a list of strings and merge the result in an interval array
 * @see: https://stackoverflow.com/questions/26390938/merge-arrays-with-overlapping-values#answer-26391774
 * @param source Source string
 * @param searches Strings to search
 * @returns A list of occurrences in the format of [[from, to], [from, to]]
 */
export function findStrOccurrences (source: string, searches: string[]): IntervalArray {
  let result: IntervalArray = [];
  for (let i = 0; i < searches.length; i++) {
    const str = searches[i];
    let index = -1;
    while ((index = source.indexOf(str, index + 1)) > -1) {
      result.push([index, index + str.length - 1]);
    }
  }
  // sort the interval array
  const sortedResult: IntervalArray = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  result = [];
  let last: [number, number];
  // merge overlapped ranges
  sortedResult.forEach(r => !last || r[0] > last[1] + 1 ? result.push(last = r) : r[1] > last[1] && (last[1] = r[1]));
  return result;
};

const enum Position { Left = -1, Middle = 0, Right = 1 };

/**
 * Check the position of the number of a specific range
 * @param num
 * @param range
 */
function getPosition(num: number, range: [number, number]): Position {
  switch (true) {
    case num < range[0]:
      return Position.Left;
    case num > range[1]:
      return Position.Right;
  }
  return Position.Middle;
};

/**
 * Check if the given `num` is in the `rangeArr` interval array using Binary Search algorithm
 * @param num
 * @param rangeArr
 */
export function inRange(num: number, rangeArr: IntervalArray): boolean {
  if (rangeArr.length === 0) {
    return false;
  }
  const testIndex = Math.floor(rangeArr.length / 2);
  switch (getPosition(num, rangeArr[testIndex])) {
    case Position.Left:
      return inRange(num, rangeArr.slice(0, testIndex));
    case Position.Right:
      return inRange(num, rangeArr.slice(testIndex + 1));
  }
  return true;
};

/**
 * Custom RegExp replace function to replace all unnecessary strings into target replacement string
 * @param source Source string
 * @param regexp Used to search through the source string
 * @param replacement Replace matched RegExp with replacement value
 * @param ignored Ignore certain string values within the matched strings
 */
export function regexpReplaceCustom(source: string, regexp: RegExp, replacement: string, ignored: string[] = []) {
  // RegExp version of ignored
  const ignoredRegexp = ignored.length ? RegExp(ignored.map(escapeRegExp).join('|'), 'g') : null;
  // clones regex and with g flag
  const rule = RegExp(regexp.source, regexp.flags.replace('g', '') + 'g');
  // final result
  let result = '';
  // used to count where
  let lastIndex = 0;
  while (true) {
    const matchMain = rule.exec(source);
    let ignoreResult = '';
    let ignoreLastIndex = 0;
    if (matchMain) {
      while (true) {
        const matchIgnore = ignoredRegexp ? ignoredRegexp.exec(matchMain[0]) : null;
        if (matchIgnore) {
          ignoreResult += matchIgnore.index > ignoreLastIndex ? replacement : '';
          ignoreResult += matchIgnore[0];
          ignoreLastIndex = ignoredRegexp!.lastIndex;
        }
        else {
          ignoreResult += matchMain[0].length > ignoreLastIndex ? replacement : '';
          break;
        }
      }
      result += source.substring(lastIndex, matchMain.index) + ignoreResult;
      lastIndex = rule.lastIndex;
    } else {
      result += source.substring(lastIndex, source.length);
      break;
    }
  }
  return result;
};
