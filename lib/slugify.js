import transliterate from './transliterate';
import { escapeRegExp } from './utils';

// Slugify
const defaultOptions = {
  lowercase: true,
  separator: '-',
  replace: {},
  ignore: [],
};

const slugify = (str, options) => {
  const config = Object.assign({}, defaultOptions, options || {});
  // remove leading and trailing separators
  const sep = escapeRegExp(config.separator);
  let slug = transliterate(str).replace(/[^a-zA-Z0-9]+/g, config.separator);
  if (config.lowercase) {
    slug = slug.toLowerCase();
  }

  slug = slug.replace(new RegExp(`^(${sep})+|(${sep})+$`, 'g'), '');
  return slug;
};

slugify.config = (options = {}) => Object.assign(defaultOptions, options);

export default slugify;
