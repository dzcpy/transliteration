# Transliteration

Transliteration module for node.js. Transliterate unicode characters into latin ones. Supports all common unicode characters including CJK.

## Install

```
npm install transliteration
```

## Usage

### transliteration(str, unknown)

Transliterate `str`. Unknown characters will be converted to `unknown`

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
Leave it blank to use the above default values.

__Example__
```javascript
var slugify = require('transliteration').slugify;
slugify('你好，世界'); // ni-hao-shi-jie
slugify('你好，世界', {lowercase: false, separator: '_'}); // Ni_Hao_Shi_Jie
```

### Client side usage
```
bower install transliteration
```
You can also use this module in the browser. Please check example.html for detailed usage.