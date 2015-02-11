# Transliteration

Transliteration module for node.js. It converts special characters in unicode text into corresponding ascii letters, with support of nearly every common languages including CJK (Chinese, Japanese and Korean).

## Install

```
npm install transliteration
```

## Usage

### transliteration(str, [unknown])

Transliterate the string `str`. Characters which this module doesn't recognise will be converted to the character in the `unknown` parameter, defaults to `?`.

__Example__
```javascript
var tr = require('transliteration');
tr('你好，世界'); // Ni Hao ,Shi Jie
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
slugify('你好，世界', {lowercase: false, separator: '_'}); // Ni_Hao_Shi_Jie
```

### Client side usage
Transliteration module can be run in the browser as well.

Donload the library with bower:
```
bower install transliteration
```
It supports AMD / CommonJS standard or just to be loaded as a global variable.

When use in the browser, by default it will create global variables under `window` object:
```javascript
TR('你好, World'); // window.TR
// or
Transliteration('String'); // window.Transliteration
```
If you don't like the default variable names or they conflict with other libraries, you can call noConfilict() method before loading other libraries, then both `window.TR` and `window.Transliteration` will be deleted from windows object and Transliteration function will be returned:
```javascript
var trans = Transliteration.noConflict();
trans('你好, World');
trans.slugify('你好, World');
```

For detailed usage, please check [example.html](http://rawgit.com/andyhu/node-transliteration/master/example.html).
