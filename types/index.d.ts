/**
 * TransliterateOptions/SlugifyOptions replace type
 */
type ReplaceOptionsType = { [prop: string]: string } | Array<[string, string]>

/**
 * transliterate(options: TransliterateOptions)
 * @example tr('你好，世界', { replace: {你: 'You'}, ignore: ['好'] })
 * @link https://github.com/linkFly6/transliteration/tree/1.6.5#transliteratestr-options
 */
export interface TransliterateOptions {
  /**
   * Unicode characters that are not in the database will be replaced with `unknown`
   * @default [?]
   */
  unknown?: string
  /**
   * Custom replacement of the strings before transliteration
   * Object form of argument or Array form of argument
   * @example tr('你好，世界', { replace: {你: 'You'}, ignore: ['好'] }) -> You 好, Shi Jie
   * @example tr('你好，世界', { replace: [['你', 'You']], ignore: ['好'] }) -> You 好, Shi Jie (option in array form)
   */
  replace?: ReplaceOptionsType
  /**
   * Strings in the ignore list will be bypassed from transliteration
   * @default []
   */
  ignore?: Array<string>
}

/**
 * slugify(options: TransliterateOptions)
 * @example slugify.config({ replace: [['你好', 'Hello']] })
 * @link https://github.com/linkFly6/transliteration/tree/1.6.5#slugifystr-options
 */
export interface SlugifyOptions {
  /**
   * Whether to force slags to be lowercased
   * @default true
   */
  lowercase?: boolean,
  /**
   * Separator of the slug
   * @default '-'
   */
  separator?: string, // default: '-'
  /**
   * Custom replacement of the strings before transliteration
   * @example slugify('你好，世界', { lowercase: false, separator: '_' })  -> hello_world
   * @example slugify('你好，世界', { replace: [['你好', 'Hello'], ['世界', 'world']], separator: '_' }) -> hello_world
   */
  replace?: ReplaceOptionsType
  /**
   * Strings in the ignore list will be bypassed from transliteration
   */
  ignore?: Array<string> // default: []
}


/**
 * set/get transliterate/slugify defaults config
 */
interface IConfigDefaultOptionsHandler<T> {
  /**
   * set configurations
   * @see TransliterateOptions
   */
  (defaults: T): void
  /**
   * get configurations
   * @see TransliterateOptions
   */
  (): T
}

/**
 * Transliterates the string str and return the result. 
 * Characters which this module doesn't recognise will be defaulted to the placeholder from the unknown argument in the configuration option, defaults to [?].
 * @example import { transliterate as tr } from 'transliteration'
 * @link https://github.com/linkFly6/transliteration/tree/1.6.5#nodejs
 */
export declare const transliterate: {
  /**
   * Transliterates the string str and return the result. 
   * Characters which this module doesn't recognise will be defaulted to the placeholder from the unknown argument in the configuration option, defaults to [?].
   * @example tr('你好，世界'); // Ni Hao , Shi Jie
   * @example tr('안녕하세요, 세계'); // annyeonghaseyo, segye
   * @example tr('你好，世界', { replace: [['你', 'You']], ignore: ['好'] }) // You 好, Shi Jie (option in array form)
   * @link https://github.com/linkFly6/transliteration/tree/1.6.5#transliteratestr-options
   */
  (str: string, options?: TransliterateOptions): string
  /**
   * Bind options globally so any following calls will be using optoinsObj by default. 
   * If optionsObj argument is omitted, it will return current default option object.
   * @example tr.config({ replace: [['你', 'You']], ignore: ['好'] });
   */
  config: IConfigDefaultOptionsHandler<TransliterateOptions>
}


/**
 * Converts Unicode string to slugs. 
 * So it can be safely used in URL or file name.
 * @example import { slugify } from 'transliteration'
 * @link https://github.com/linkFly6/transliteration/tree/1.6.5#nodejs
 */
export declare const slugify: {
  /**
   * Converts Unicode string to slugs.
   * So it can be safely used in URL or file name.
   * @example slugify('你好，世界'); // ni-hao-shi-jie
   * @example slugify('你好，世界', { lowercase: false, separator: '_' }); // Ni_Hao_Shi_Jie
   * @example slugify('你好，世界', { ignore: ['你好'] }); // 你好shi-jie
   * @link https://github.com/linkFly6/transliteration/tree/1.6.5#slugifystr-options
   */
  (str: string, options?: SlugifyOptions): string
  /**
   * Bind options globally so any following calls will be using optoinsObj by default. 
   * If optionsObj argument is omitted, it will return current default option object.
   * @example slugify.config({ lowercase: false, separator: '_' });
   */
  config: IConfigDefaultOptionsHandler<SlugifyOptions>
}
