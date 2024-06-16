import { describe, expect, test } from '@jest/globals';
import fs from "fs";

import { parser } from "../../src/parser";
import { detectRepeatedStructures, formatResponse } from "../../src/extractLongestDuplicates";

interface Case {
  input: string;
  contain: string;
  notContain?: string;
  length: number;
}

describe('test extractLongestduplicates.ts', () => {
  const htmls: Case[] = [
    {
      input: 'test/assets/parse/simple1.html',
      contain: 'Parag',
      length: 3
    },
    {
      input: 'test/assets/parse/simple2.html',
      contain: 'Parag',
      length: 2
    },
    {
      input: 'test/assets/parse/simple3.html',
      contain: 'Parag',
      length: 2
    },
    {
      input: 'test/assets/parse/simple4.html',
      contain: 'row',
      length: 4
    },
    {
      input: 'test/assets/parse/simple5.html',
      contain: 'this',
      notContain: 'not d',
      length: 2
    }
  ]
  htmls.map((thecase: Case) => {
    const html = fs.readFileSync(thecase.input, "utf8").toString();
    const root = parser(html);
    const repeatedStructures = detectRepeatedStructures(root);
    test('parsed node should not be null : ' + thecase.input, () => {
      expect(root).toBeTruthy();
    })

    test('extracted node are truthy : ' + thecase.input, () => {
      expect(repeatedStructures).toBeTruthy();
    })
    test('extracted node contains the string : ' + thecase.input, () => {
      expect(formatResponse(repeatedStructures)).toContain(thecase.contain);
    })
    test('extracted node not to be contain the string : ' + thecase.input, () => {
      if (thecase.notContain) {
        expect(formatResponse(repeatedStructures)).not.toContain(thecase.notContain);
      }
    })
    test('extracted node are list of list : ' + thecase.input, () => {
      expect(repeatedStructures[0]).toHaveLength(thecase.length);
    })
  })
});
