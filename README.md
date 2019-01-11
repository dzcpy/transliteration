# Transliteration

[![Build Status](	https://img.shields.io/circleci/project/github/dzcpy/transliteration.svg)](https://circleci.com/gh/dzcpy/transliteration)
[![Dependencies](https://img.shields.io/david/dzcpy/transliteration.svg)](https://github.com/dzcpy/transliteration/blob/master/package.json)
[![Dev Dependencies](https://img.shields.io/david/dev/dzcpy/transliteration.svg)](https://github.com/dzcpy/transliteration/blob/master/package.json)
[![Coverage Status](https://coveralls.io/repos/github/dzcpy/transliteration/badge.svg?branch=master)](https://coveralls.io/github/dzcpy/transliteration?branch=master)
[![NPM Version](https://img.shields.io/npm/v/transliteration.svg)](https://www.npmjs.com/package/transliteration)
[![NPM Download](https://img.shields.io/npm/dm/transliteration.svg)](https://www.npmjs.com/package/transliteration)
[![License](https://img.shields.io/npm/l/transliteration.svg)](https://github.com/dzcpy/transliteration/blob/master/LICENSE.txt)

Universal unicode -> latin transliteration / slugify module. Works with all major languages and on all platforms.

## Demo

[Try it out](http://dzcpy.github.io/transliteration)

### Compatibility / Browser support

IE 10+ and all modern browsers.

Node.js, in the browser, Web Worker, ReactNative and CLI

## Installation

### Node.js / React Native

```bash
npm install transliteration --save
```

```javascript
import { transliterate as tr, slugify } from 'transliteration';

tr('你好, world!'); // Ni Hao , world!
slugify('你好, world!'); // ni-hao-world
```

### Browser

__CDN:__

```html
<!-- UMD build -->
<script async defer  src="https://cdn.jsdelivr.net/npm/transliteration@2.0.0-alpha1/dist/browser/bundle.umd.min.js"></script>
<!-- ESM build -->
<script async defer src="https://cdn.jsdelivr.net/npm/transliteration@2.0.0-alpha1/dist/browser/bundle.esm.min.js" type="module"></script>
<script type="module">
  import { transl } from './bundle.esm.min.js';
  console.log(transl('你好'));
</script>
```

`transliteration` can be loaded as an AMD / CommonJS module, or as global variables (UMD).

When using it in the browser, by default it will create global variables under `window` object:

```javascript
transl('你好, World'); // window.transl
// or
slugify('Hello, 世界'); // window.slugify
```

### CLI

```bash
npm install transliteration -g

transliterate 你好 # Ni Hao
slugify 你好 # ni-hao
echo 你好 | slugify -S # ni-hao
```

## Usage

### transliterate(str, [options])

Transliterates the string `str` and return the result. Characters which this module doesn't recognise will be defaulted to the placeholder from the `unknown` argument in the configuration option, defaults to `[?]`.

__Options:__ (optional)

```javascript
{
  /**
   * Ignore a list of strings untouched
   * @example tr('你好，世界', { ignore: ['你'] }) // 你 Hao , Shi Jie
   */
  ignore?: string[];
  /**
   * Replace a list of string / regex in the source string into the provided target string before transliteration
   * The option can either be an array or an object
   * @example tr('你好，世界', { replace: {你: 'You'} }) // You Hao , Shi Jie
   * @example tr('你好，世界', { replace: [['你', 'You']] }) // You Hao , Shi Jie
   * @example tr('你好，世界', { replace: [[/你/g, 'You']] }) // You Hao , Shi Jie
   */
  replace?: OptionReplaceCombined;
  /**
   * Same as `replace` but after transliteration
   */
  replaceAfter?: OptionReplaceCombined;
  /**
   * Decides whether or not to trim the result string after transliteration
   * @default false
   */
  trim?: boolean;
  /**
   * Any characters not known by this library will be replaced by a specific string `unknown`
   * @default ''
   */
  unknown?: string;
}
```

### transliterate.config([optionsObj])

Bind options globally so any following calls will be using `optoinsObj` by default. If `optionsObj` argument is omitted, it will return current default option object.

```javascript
transliterate.config({ replace: [['你好', 'Hello']] });
transliterate('你好, world!'); // Result: 'Hello, world!'. This equals transliterate('你好, world!', { replace: [['你好', 'Hello']] });
```

__Examples:__

```javascript
import { transliterate as tr } from 'transliteration';
tr('你好，世界'); // Ni Hao , Shi Jie
tr('Γεια σας, τον κόσμο'); // Geia sas, ton kosmo
tr('안녕하세요, 세계'); // annyeonghaseyo, segye
tr('你好，世界', { replace: {你: 'You'}, ignore: ['好'] }) // You 好, Shi Jie
tr('你好，世界', { replace: [['你', 'You']], ignore: ['好'] }) // You 好, Shi Jie (option in array form)
// or use configurations
tr.config({ replace: [['你', 'You']], ignore: ['好'] });
tr('你好，世界') // You 好, Shi Jie
// get configurations
console.log(tr.config());
```

### slugify(str, [options])

Converts Unicode string to slugs. So it can be safely used in URL or file name.

__Options:__ (optional)

```javascript
  /**
   * Ignore a list of strings untouched
   * @example tr('你好，世界', { ignore: ['你'] }) // 你 Hao , Shi Jie
   */
  ignore?: string[];
  /**
   * Replace a list of string / regex in the source string into the provided target string before transliteration
   * The option can either be an array or an object
   * @example tr('你好，世界', { replace: {你: 'You'} }) // You Hao , Shi Jie
   * @example tr('你好，世界', { replace: [['你', 'You']] }) // You Hao , Shi Jie
   * @example tr('你好，世界', { replace: [[/你/g, 'You']] }) // You Hao , Shi Jie
   */
  replace?: OptionReplaceCombined;
  /**
   * Same as `replace` but after transliteration
   */
  replaceAfter?: OptionReplaceCombined;
  /**
   * Decides whether or not to trim the result string after transliteration
   * @default false
   */
  trim?: boolean;
  /**
   * Any characters not known by this library will be replaced by a specific string `unknown`
   * @default ''
   */
  unknown?: string;
  /**
   * Whether the result need to be converted into lowercase
   * @default true
   */
  lowercase?: boolean;
  /**
   * Whether the result need to be converted into uppercase
   * @default false
   */
  uppercase?: boolean;
  /**
   * Custom separator string
   * @default '-'
   */
  separator?: string;
  /**
   * Allowed characters.
   * When `allowedChars` is set to `'abc'`, then only characters match `/[abc]/g` will be preserved.
   * Other characters will all be converted to `separator`
   * @default 'a-zA-Z0-9-_.~''
   */
  allowedChars?: string;
```

If `options` is not provided, it will use the above default values.

### slugify.config([optionsObj])

Bind options globally so any following calls will be using `optoinsObj` by default. If `optionsObj` argument is omitted, it will return current default option object.

```javascript
slugify.config({ replace: [['你好', 'Hello']] });
slugify('你好, world!'); // Result: 'hello-world'. This equals slugify('你好, world!', { replace: [['你好', 'Hello']] });
```

__Example:__

### Node.js / webpack

```javascript
import { slugify } from 'transliteration';
slugify('你好，世界'); // ni-hao-shi-jie
slugify('你好，世界', { lowercase: false, separator: '_' }); // Ni_Hao_Shi_Jie
slugify('你好，世界', { replace: {你好: 'Hello', 世界: 'world'}, separator: '_' }); // hello_world
slugify('你好，世界', { replace: [['你好', 'Hello'], ['世界', 'world']], separator: '_' }); // hello_world (option in array form)
slugify('你好，世界', { ignore: ['你好'] }); // 你好shi-jie
// or use configurations
slugify.config({ lowercase: false, separator: '_' });
slugify('你好，世界'); // Ni_Hao_Shi_Jie
// get configurations
console.log(slugify.config());
```

If the variable names conflict with other libraries in your project or you prefer not to use global variables, use noConfilict() before loading libraries which contain the conflicting variables.:

### CLI

```
➜  ~ transliterate --help
Usage: transliterate <unicode> [options]

Options:
  --version      Show version number                                                       [boolean]
  -u, --unknown  Placeholder for unknown characters                           [string] [default: ""]
  -r, --replace  Custom string replacement                                     [array] [default: []]
  -i, --ignore   String list to ignore                                         [array] [default: []]
  -S, --stdin    Use stdin as input                                       [boolean] [default: false]
  -h, --help                                                                               [boolean]

Examples:
  transliterate "你好, world!" -r 好=good -r          Replace `,` into `!`, `world` into `shijie`.
  "world=Shi Jie"                                     Result: Ni good, Shi Jie!
  transliterate "你好，世界!" -i 你好 -i ，           Ignore `你好` and `，`.
                                                      Result: 你好，Shi Jie !
```

```
➜  ~ slugify --help
Usage: slugify <unicode> [options]

Options:
  --version        Show version number                                                     [boolean]
  -U, --unknown    Placeholder for unknown characters                         [string] [default: ""]
  -l, --lowercase  Peturns result in lowercase                             [boolean] [default: true]
  -u, --uppercase  Returns result in uppercase                            [boolean] [default: false]
  -s, --separator  Separator of the slug                                     [string] [default: "-"]
  -r, --replace    Custom string replacement                                   [array] [default: []]
  -i, --ignore     String list to ignore                                       [array] [default: []]
  -S, --stdin      Use stdin as input                                     [boolean] [default: false]
  -h, --help                                                                               [boolean]

Examples:
  slugify "你好, world!" -r 好=good -r "world=Shi     Replace `,` into `!` and `world` into
  Jie"                                                `shijie`.
                                                      Result: ni-good-shi-jie
  slugify "你好，世界!" -i 你好 -i ，                 Ignore `你好` and `，`.
                                                      Result: 你好，shi-jie

```


## Change log

### 2.0.0

* **CDN file path changes**
* The entire module was refactored in Typescript, with a big performance improvement as well as a reduced package size.
* Better code quality. 100% unit tested.
* `bower` support was dropped. Please use CDN or together with a js bundler like `webpack` or `rollup`.
* As according to RFC 3986, more characters(`/a-zA-Z0-9-_.~/`) are kept as result for `slugify`

### 1.6.6

* Added support for `TypeScript`. #77

### 1.5.0

* Minimum node requirement: 6.0+

### 1.0.0

* Code had been entirely refactored since version 1.0.0. Be careful when you plan to upgrade from v0.1.x or v0.2.x to v1.0.x

__Changes:__

* The `options` parameter of `transliterate` now is an `Object` (In 0.1.x it's a string `unknown`).
* Added `transliterate.config` and `slugify.config`.
* Unknown string will be transliterated as `[?]` instead of `?`.
* In the browser, global variables have been changed to `window.transl` and `windnow.slugify`. Other global variables are removed.


## Caveats

Currently, `transliteration` only supports 1 to 1 code map (from Unicode to Latin). It is the simplest way to implement, but there are some limitations when dealing with polyphonic characters. It does not work well with all languages, please test all possible situations before using it. Some known issues are:

* __Chinese:__ Polyphonic characters are not always transliterated correctly. Alternative: `pinyin`.

* __Japanese:__ Most Japanese Kanji characters are transliterated into Chinese Pinyin because of the overlapped code map in Unicode. Also there are many polyphonic characters in Japanese which makes it impossible to transliterate Japanese Kanji correctly without tokenizing the sentence. Consider using `kuroshiro` for a better Kanji -> Romaji conversion.

* __Thai:__ Currently it is not working. If you know how to make it work, please contact me.

* __Cylic:__ Cylic characters are overlapped between a few languages. The result might be inaccurate in some specific languages, for example Bulgarian.

If you there's any other issues, please raise a ticket.

### License

MIT
