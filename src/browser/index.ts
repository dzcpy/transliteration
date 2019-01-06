import { slugify, transliterate } from '../node';
import { BrowserGlobalObject } from '../types';

const bindGlobals = (globalObj: BrowserGlobalObject) => {
  const obj: BrowserGlobalObject = globalObj;
  obj.transl = transliterate;
  obj.slugify = slugify;
  obj.transl.noConflict = () => {
    const tr = obj.transl;
    delete obj.transl;
    return tr;
  };
  obj.slugify.noConflict = () => {
    const sl = slugify;
    delete obj.slugify;
    return sl;
  };
};

declare var self: BrowserGlobalObject;
declare var WorkerGlobalScope: any;

try {
  // Webworker
  if (typeof WorkerGlobalScope !== 'undefined' && typeof self !== 'undefined') {
    bindGlobals(self);
  }
} catch (e) {
  console.error(e);
}

export { transliterate as transl, slugify };
