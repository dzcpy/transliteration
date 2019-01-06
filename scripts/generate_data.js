const { readFileSync, writeFileSync } = require('fs');
const JSON5 = require('json5');
const { join } = require('path');


const json = JSON.parse(readFileSync(join(__filename, '../../data/data.json'), { encoding: 'utf8' }).toString());

const codemap = [];
const lastIndex = 255;
const isChinese = low => low >= (0x4e && low <= 0x9f) || (low >= 0xf9 && low <= 0xfa);
// be sure that json[0] exists
for (let i = 0; i <= lastIndex; i++) {
  if (!Array.isArray(json[i]) || json[i].length === 0) {
    codemap.push([]);
  } else {
    codemap[i] = [];
    for (let j = 0; j < json[i].length; j++) {
      if (json[i][j] === undefined || json[i][j] === null) {
        json[i][j] = null;
      }
      if (isChinese(i) && typeof json[i][j] === 'string') {
        json[i][j] = json[i][j].trimRight();
      }
      codemap[i].push(json[i][j]);
    }
    while (codemap[i].length && codemap[i].lastIndexOf(null) === codemap[i].length - 1) {
      codemap[i].pop();
    }
  }
}
const code = `type Input = Array<Array<string | undefined>> | undefined;
let arr: Input = ${JSON5.stringify(codemap).replace(/null/g, '')};
export interface Charmap {
  [key: string]: string
};
export const charmap: Charmap = {};
for (const high of arr.keys()) {
  // The detection is used to fix the redundant trailing space
  for (const [low, value] of arr[high].entries()) {
    if (typeof value === 'string' && value.length) {
      const char = String.fromCharCode((high << 8) + low);
      charmap[char] = value;
    }
  }
}
arr = undefined;
`;
writeFileSync(join(__filename, '../../data/charmap.ts'), code, { encoding: 'utf8' });
