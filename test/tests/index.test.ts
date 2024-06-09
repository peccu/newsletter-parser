import { describe, expect, test } from '@jest/globals';
import fs from "fs";

import parser from '../../src/index';

describe('test index.ts', () => {
  const html = fs.readFileSync('test/assets/parse/simple1.html', "utf8").toString();
  test('parser should not be throw', () => {
    expect(() => parser(html)).not.toThrowError();
  })
});
