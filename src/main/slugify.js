import transliterate from './transliterate';
import { escapeRegExp, mergeOptions } from './utils';

// Slugify
const defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: [],
  replaceAfter: [],
  ignore: [],
};
let configOptions = {};

const slugify = (str, options) => {
  options = options ? mergeOptions(defaultOptions, options) : mergeOptions(defaultOptions, configOptions);
  // remove leading and trailing separators
  const sep = escapeRegExp(options.separator);
  options.replaceAfter.push([/[^a-zA-Z0-9]+/g, options.separator], [new RegExp(`^(${sep})+|(${sep})+$`, 'g'), '']);
  const transliterateOptions = { replaceAfter: options.replaceAfter, replace: options.replace, ignore: options.ignore };
  let slug = transliterate(str, transliterateOptions);
  if (options.lowercase) {
    slug = slug.toLowerCase();
  }
  return slug;
};

slugify.config = (options) => {
  if (options === undefined) {
    return configOptions;
  }
  configOptions = mergeOptions(defaultOptions, options);
  return configOptions;
};

export default slugify;
