var tr = require('../');
var assert = require('assert');

describe('transliteration', function() {
  it('should not alter strings that only contain ascii characters', function() {
    assert.deepEqual(tr('['), '[', 'should not alter opening bracket');
    assert.deepEqual(tr(']'), ']', 'should not alter closing bracket');

    var enAlphabetAndSymbols = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()\'"?[]<>,-_+=`~';
    assert.deepEqual(tr(enAlphabetAndSymbols), enAlphabetAndSymbols,
      'should not alter english alphabet (lowercase)');

    assert.deepEqual(tr(enAlphabetAndSymbols.toUpperCase()), enAlphabetAndSymbols.toUpperCase(),
      'should not alter english alphabet (uppercase)');
  });
});
