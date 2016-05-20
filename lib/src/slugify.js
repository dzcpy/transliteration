import transliterate from './transliterate';
import { escapeRegExp, mergeOptions } from './utils';

// Slugify
let defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: [],
  replaceAfter: [],
  ignore: [],
};

const slugify = (str, options) => {
  options = mergeOptions(defaultOptions, options);
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

slugify.config = options => {
  defaultOptions = mergeOptions(defaultOptions, options);
  return defaultOptions;
};

export default slugify;
