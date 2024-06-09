import { describe, expect, test } from '@jest/globals';
import fs from "fs";

import { parser } from "../../src/parser";
import { detectRepeatedStructures, formatResponse } from "../../src/extractLongestDuplicates";

interface Case {
  input: string;
  contain: string;
  length: number;
}

describe('test index.ts', () => {
  const htmls: Case[] = [
    {
      input: 'test/assets/parse/simple1.html',
      contain: 'Paragraph',
      length: 3
    },
    {
      input: 'test/assets/parse/simple2.html',
      contain: 'Paragraph',
      length: 2
    },
    {
      input: 'test/assets/parse/simple3.html',
      contain: 'Paragraph',
      length: 2
    },
    {
      input: 'test/assets/parse/simple4.html',
      contain: 'row',
      length: 4
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
      expect(formatResponse(repeatedStructures)).toContain(thecase.contain);
    })
    test('extracted node are list of list', () => {
      expect(repeatedStructures[0]).toHaveLength(thecase.length);
    })
  })
});
