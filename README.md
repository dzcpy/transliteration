# Transliteration
[![Build Status](https://travis-ci.org/andyhu/node-transliteration.svg)](https://travis-ci.org/andyhu/node-transliteration)
[![NPM Version](https://img.shields.io/npm/v/transliteration.svg)](https://www.npmjs.com/package/transliteration)
![Bower](https://img.shields.io/bower/v/transliteration.svg)
[![Dependencies](https://img.shields.io/david/andyhu/node-transliteration.svg)](https://github.com/andyhu/node-transliteration/blob/master/package.json)
[![Dev Dependencies](https://img.shields.io/david/dev/andyhu/node-transliteration.svg)](https://github.com/andyhu/node-transliteration/blob/master/package.json)
[![NPM Download](https://img.shields.io/npm/dm/transliteration.svg)](https://www.npmjs.com/package/transliteration)
[![License](https://img.shields.io/npm/l/transliteration.svg)](https://github.com/andyhu/node-transliteration/blob/master/LICENSE.txt)

Transliteration module for node.js and browser. Transliterate unicode special characters into corresponding pure ascii so it can be safely used as URL slug or as file name etc., with support of nearly every common languages including CJK (Chinese, Japanese and Korean).

## Install in Node.js

```
npm install transliteration --save
```
### Breaking changes since 1.0.0
Please note that the code has been entirely refactored since version 1.0.0.

## Usage

### transliterate(str, options)

Transliterate the string `str`. Characters which this module doesn't recognise will be converted to the character in the `unknown` parameter, defaults to `[?]`.

__Example__
```javascript
var tr = require('transliteration').transliterate;
tr('你好，世界'); // Ni Hao , Shi Jie
tr('Γεια σας, τον κόσμο'); // Geia sas, ton kosmo
tr('안녕하세요, 세계'); // annyeonghaseyo, segye
```

### slugify(str, options)

Converts unicode string to slugs. So it can be safely used in URL or file name.

__Options:__
```
{
  lowercase: true,
  separator: '-'
}
```
If no `options` parameter provided it will use the above default values.

__Example:__
```javascript
var slugify = require('transliteration').slugify;
slugify('你好，世界'); // ni-hao-shi-jie
slugify('你好，世界', { lowercase: false, separator: '_' }); // Ni_Hao_Shi_Jie
```

### Usage in browser
Transliteration module can be run in the browser as well.

Download the library with bower:
```
bower install transliteration
```
It supports AMD / CommonJS standard or just to be loaded as a global variable (UMD).

When use in browser, by default it will create global variables under `window` object:
```javascript
transl('你好, World'); // window.transl
// or
slugify('Hello, 世界'); // window.slugify
```
If the name of the variables conflict with other libraries in your project or you prefer not to use global variables, you can then call noConfilict() before loading other libraries which contails the possible conflict.:
```javascript
var tr = transl.noConflict();
console.log(transl); // undefined
tr('你好, World'); // Ni Hao , World
var slug = slugify.noConfilict();
slug('你好, World'); // ni-hao-world
console.log(slugify); // undefined
```

For detailed usage, please check the demo at [example.html](http://rawgit.com/andyhu/node-transliteration/master/demo/example.html).
