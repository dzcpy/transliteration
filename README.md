# Transliteration

[![Build Status](https://travis-ci.org/andyhu/transliteration.svg)](https://travis-ci.org/andyhu/transliteration)
[![Dependencies](https://img.shields.io/david/andyhu/transliteration.svg)](https://github.com/andyhu/transliteration/blob/master/package.json)
[![Dev Dependencies](https://img.shields.io/david/dev/andyhu/transliteration.svg)](https://github.com/andyhu/transliteration/blob/master/package.json)
[![Coverage Status](https://coveralls.io/repos/github/andyhu/node-transliteration/badge.svg?branch=master)](https://coveralls.io/github/andyhu/transliteration?branch=master)
[![NPM Version](https://img.shields.io/npm/v/transliteration.svg)](https://www.npmjs.com/package/transliteration)
[![NPM Download](https://img.shields.io/npm/dm/transliteration.svg)](https://www.npmjs.com/package/transliteration)
[![License](https://img.shields.io/npm/l/transliteration.svg)](https://github.com/andyhu/transliteration/blob/master/LICENSE.txt)
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/andyhu/transliteration)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/node-transliteration.svg)](https://saucelabs.com/u/node-transliteration)

Transliteration / slugify module for node.js, browser, Web Worker, ReactNative and CLI. It provides the ability to transliterate UTF-8 characters into corresponding pure ASCII; so they can be safely displayed, used as URL slugs or file names.

## Demo

[example.html](http://andyhu.github.io/transliteration)

## Installation

### Node.js

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

<script src="https://unpkg.com/transliteration/lib/browser/transliteration.min.js"></script>
```

__Bower:__

```bash
# Install bower if not already installed
# npm install bower -g
bower install transliteration
```

```html
<html>
<head>
  <script src="bower_components/transliteration/transliteration.min.js"></script>
</head>
<body>
  <script>
    transl('你好, world!'); // Ni Hao , world!
    slugify('你好, world!'); // ni-hao-world
  </script>
</body>
</html>
```

### Browser support

`transliteration` has a good browser compatibility with all major browsers (including IE 6-8 if used with `es5-shim`).

### CLI

```bash
npm install transliteration -g

transliterate 你好 # Ni Hao
slugify 你好 # ni-hao
echo 你好 | slugify -S # ni-hao
```

### ReactNative

```javascript
import { transliterate, slugify } from 'transliteration/src/main/browser';
```

## Change log

### 1.7.0 (breaking)

`bower` support is dropped. Please use CDN or a js bundler like `webpack`.

### 1.6.6

Added support for `TypeScript`. #77

### 1.5.0 (breaking)

Since version 1.5.0, `transliteration` module requires minimum node version v6.0.

### 1.0.0 (breaking)

Please note that the code has been entirely refactored since version 1.0.0. Be careful when you plan to upgrade from v0.1.x or v0.2.x to v1.0.x

__Changes:__

* The `options` parameter of `transliterate` now is an `Object` (In 0.1.x it's a string `unknown`).
* Added `transliterate.config` and `slugify.config`.
* Unknown string will be transliterated as `[?]` instead of `?`.
* In the browser, global variables have been changed to `window.transl` and `windnow.slugify`. Other global variables are removed.

## Usage

### transliterate(str, [options])

Transliterates the string `str` and return the result. Characters which this module doesn't recognise will be defaulted to the placeholder from the `unknown` argument in the configuration option, defaults to `[?]`.

__Options:__ (optional)

```javascript
{
  /* Unicode characters that are not in the database will be replaced with `unknown` */
  unknown: '[?]', // default: [?]
  /* Custom replacement of the strings before transliteration */
  replace: { source1: target1, source2: target2, ... }, // Object form of argument
  replace: [[source1, target1], [source2, target2], ... ], // Array form of argument
  /* Strings in the ignore list will be bypassed from transliteration */
  ignore: [str1, str2] // default: []
}
```

__transliterate.config([optionsObj])__

Bind options globally so any following calls will be using `optoinsObj` by default. If `optionsObj` argument is omitted, it will return current default option object.

```javascript
transliterate.config({ replace: [['你好', 'Hello']] });
transliterate('你好, world!'); // Result: 'Hello, world!'. This equals transliterate('你好, world!', { replace: [['你好', 'Hello']] });
```

__Example__

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
{
  /* Whether to force slags to be lowercased */
  lowercase: false, // default: true
  /* Separator of the slug */
  separator: '-', // default: '-'
  /* Custom replacement of the strings before transliteration */
  replace: { source1: target1, source2: target2, ... },
  replace: [[source1, target1], [source2, target2], ... ], // default: []
  /* Strings in the ignore list will be bypassed from transliteration */
  ignore: [str1, str2] // default: []
}
```

If `options` is not provided, it will use the above default values.

__slugify.config([optionsObj])__

Bind options globally so any following calls will be using `optoinsObj` by default. If `optionsObj` argument is omitted, it will return current default option object.

```javascript
slugify.config({ replace: [['你好', 'Hello']] });
slugify('你好, world!'); // Result: 'hello-world'. This equals slugify('你好, world!', { replace: [['你好', 'Hello']] });
```

__Example:__

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

### Usage in browser

`transliteration` can be loaded as an AMD / CommonJS module, or as global variables (UMD).

When using it in the browser, by default it will create global variables under `window` object:

```javascript
transl('你好, World'); // window.transl
// or
slugify('Hello, 世界'); // window.slugify
```

If the variable names conflict with other libraries in your project or you prefer not to use global variables, use noConfilict() before loading libraries which contain the conflicting variables.:

__Load the library globally__

```javascript
var tr = transl.noConflict();
console.log(transl); // undefined
tr('你好, World'); // Ni Hao , World
var slug = slugify.noConfilict();
slug('你好, World'); // ni-hao-world
console.log(slugify); // undefined
```

### Usage in command line

```
➜  ~ transliterate --help
Usage: transliterate <unicode> [options]

Options:
  --version      Show version number                                                       [boolean]
  -u, --unknown  Placeholder for unknown characters                        [string] [default: "[?]"]
  -r, --replace  Custom string replacement                                     [array] [default: []]
  -i, --ignore   String list to ignore                                         [array] [default: []]
  -S, --stdin      Use stdin as input                                     [boolean] [default: false]
  -h, --help     Show help                                                                 [boolean]

Examples:
  transliterate "你好, world!" -r 好=good -r          Replace `,` into `!` and `world` into
  "world=Shi Jie"                                     `shijie`.
                                                      Result: Ni good, Shi Jie!
  transliterate "你好，世界!" -i 你好 -i ，           Ignore `你好` and `，`.
                                                      Result: 你好，Shi Jie !
                                                      Result: 你好,world!
```

```
➜  ~ slugify --help
Usage: slugify <unicode> [options]

Options:
  --version        Show version number                                                     [boolean]
  -l, --lowercase  Use lowercase                                           [boolean] [default: true]
  -s, --separator  Separator of the slug                                     [string] [default: "-"]
  -r, --replace    Custom string replacement                                   [array] [default: []]
  -i, --ignore     String list to ignore                                       [array] [default: []]
  -S, --stdin      Use stdin as input                                     [boolean] [default: false]
  -h, --help       Show help                                                               [boolean]

Examples:
  slugify "你好, world!" -r 好=good -r "world=Shi     Replace `,` into `!` and `world` into
  Jie"                                                `shijie`.
                                                      Result: ni-good-shi-jie
  slugify "你好，世界!" -i 你好 -i ，                 Ignore `你好` and `，`.
                                                      Result: 你好，shi-jie

```

### Caveats

Currently, `transliteration` uses 1 to 1 character map (from Unicode to Latin) under the hood. It is the simplest way to implement, but it has some limitations when dealing with polyphonic characters and languages which share overlapped character sets. It does not work well in some specific languages when the same characters can be transliterated differently when they are placed at different places. Some of the issues are listed below:

* __Chinese:__ Polyphonic characters are not always transliterated correctly. Alternative: `pinyinlite`.

* __Japanese:__ With `transliteration`, most Japanese Kanji characters are transliterated to Chinese Pinyin because of their overlapping of characters in Unicode. Also there are many polyphonic characters. without doing a word splitting or word mapping, it's impossible to transliterate Kanji accurately. Alternative: `kuroshiro`.

* __Thai:__ Currently it is not working. There seems no working open source project I can directly copy code from. I found some articles explaining the how to transliterate Thai though. I would appreciate if anyone who is interested implementing it can lend a hand. See: [#67](https://github.com/andyhu/transliteration/issues/67).

* __Cylic:__ Cylic characters are overlapped between a few languages. The result might be inaccurate in some specific languages, for example Bulgarian.

If you there's any other issues, please raise a ticket.

### Browser tests powered by BrowserStack

[![BrowserStack](https://raw.githubusercontent.com/andyhu/transliteration/gh-pages/browserstack-logo.png)](http://browserstack.com/)

### License

MIT
