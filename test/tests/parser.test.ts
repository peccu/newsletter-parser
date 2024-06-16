import { describe, expect, test } from '@jest/globals';
import fs from "fs";

import {
  parser
} from "../../src/parser";
import {
  detectRepeatedStructures// , formatResponse
} from "../../src/extractLongestDuplicates";

describe('test parser.ts', () => {
  const html = fs.readFileSync('test/assets/parse/simple1.html', "utf8").toString();
  const root = parser(html);
  const repeatedStructures = detectRepeatedStructures(root);
  test('parsed node should not be null', () => {
    expect(root).toBeTruthy();
  })

  test('extracted node are list of list', () => {
    expect(repeatedStructures).toBeTruthy();
  })
});
