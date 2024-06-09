import { describe, expect, test } from '@jest/globals';
import fs from "fs";

import { parser } from "../../src/parser";
import { detectRepeatedStructures, formatResponse } from "../../src/extractLongestDuplicates";

interface Case {
  input: string;
  expected: number;
}

describe('test index.ts', () => {
  const htmls: Case[] = [
    {
      input: 'test/assets/parse/simple1.html',
      expected: 3
    },
    {
      input: 'test/assets/parse/simple2.html',
      expected: 2
    },
    {
      input: 'test/assets/parse/simple3.html',
      expected: 2
    }
  ]
  htmls.map((thecase: Case) => {
    const html = fs.readFileSync(thecase.input, "utf8").toString();
    const root = parser(html);
    const repeatedStructures = detectRepeatedStructures(root);
    test('parsed node should not be null', () => {
      expect(root).toBeTruthy();
    })

    test('extracted node are list of list', () => {
      expect(repeatedStructures).toBeTruthy();
    })
    test('extracted node are list of list', () => {
      expect(formatResponse(repeatedStructures)).toContain('Paragraph');
    })
    test('extracted node are list of list', () => {
      expect(repeatedStructures[0]).toHaveLength(thecase.expected);
    })
  })
});
