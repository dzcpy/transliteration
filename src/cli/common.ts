import { OptionReplaceArray, OptionReplaceArrayItem } from "../types";

/**
 * Temporary replace token for CLI replace option
 */
export const substituteCLIReplace = '__REPLACE_SUBSTITUTE__';

/**
 * Parse string option into an array pair
 * @param option the individual `replace` option provided by the CLI command
 * @example 'x=y'
 */
export const parseReplaceOptionItem = (option: string): OptionReplaceArrayItem => {
  let substitute: string = substituteCLIReplace;
  let result: string[];
  // make sure source string doesn't have the substitute string
  while (option.indexOf(substitute) > -1) {
    substitute += substitute;
  }
  // escape for \\=
  if (option.match(/[^\\]\\\\=/)) {
    option = option.replace(/([^\\])\\\\=/g, '$1\\=');
  // escape for \=
  } else if (option.match(/[^\\]\\=/)) {
    option = option.replace(/([^\\])\\=/g, `$1${substitute}`);
  }
  result = option.split('=').map(value => value.replace(new RegExp(substitute, 'g'), '='));
  if (result.length !== 2) {
    result = [result.splice(0, 1)[0], result.join('=')];
  }
  return result as OptionReplaceArrayItem;
};

/**
 * Parse the yargs parsed `replace` option array into the actual usable option for `transliterate` function
 * @param option `replace` option
 * @example ['x=y', 'z=a']
 */
export const parseReplaceOption = (argvReplaceOption: string[]): OptionReplaceArray => {
  const replaceOption: OptionReplaceArray = [] as OptionReplaceArray;
  for (let i = 0; i < argvReplaceOption.length; i++) {
    replaceOption.push([...parseReplaceOptionItem(argvReplaceOption[i])] as OptionReplaceArrayItem);
  }
  return replaceOption;
};
