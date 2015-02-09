# Transliteration

Transliteration module for node.js. It can be used to transliterate unicode text into corresponding ascii characters, with support of nearly every commong languages including CJK (Chinese, Japanese and Korean).

## Install

```
npm install transliteration
```

## Usage

### transliteration(str, [unknown])

Transliterate `str`. Characters which this module cannot recognise will be converted to the `unknown` parameter, defaults to `?`.

__Example__
```javascript
var tr = require('transliteration');
tr('你好，世界'); // Ni Hao ,Shi Jie
tr('Γεια σας, τον κόσμο'); // Geia sas, ton kosmo
tr('안녕하세요, 세계'); // annyeonghaseyo, segye
```

### slugify(str, options)

Convert unicode string to slugs. It can be savely used in URL or file name.
You can provide an `options` parameter in the form of
```
{
  lowercase: true,
  separator: '-'
}
```
If no `options` parameter provided it will use the above default values.

__Example__
```javascript
var slugify = require('transliteration').slugify;
slugify('你好，世界'); // ni-hao-shi-jie
slugify('你好，世界', {lowercase: false, separator: '_'}); // Ni_Hao_Shi_Jie
```

### Client side usage
Transliteration module can run in browser as well. You can download it using bower:
```
bower install transliteration
```
It can be loaded as AMD / CommonJS component or global variable.

When use in the browser, by default it will create global variables under `window` object:
```javascript
TR('你好, World'); // window.TR
// or
Transliteration('String'); // window.Transliteration
```
If you don't like the default name or the variable names conflict with other libraries, you can call noConfilict() method before loading other libraries, then both `window.TR` and `window.Transliteration` will be deleted from windows object:
```javascript
var trans = Transliteration.noConflict();
trans('你好, World');
trans.slugify('你好, World');
```

Please check example.html for a quick demo.
