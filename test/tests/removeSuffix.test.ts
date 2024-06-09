import { describe, expect, test } from '@jest/globals';
// import fs from "fs";

import { removeSuffixes } from '../../src/removeSuffix';

interface Case {
  input: string[];
  expected: string[];
}

describe('test removeSuffix.ts', () => {
  const tests: Case[] = [
    {
      input: ['a', 'b', 'abc', 'bc', 'ab', 'dc', 'bd', 'eghu', 'yuh', 'ghu', 'hu', 'ft'],
      expected: ['a', 'abc', 'ab', 'dc', 'bd', 'eghu', 'yuh', 'ft']
    },
    {
      input: ['apple', 'applet', 'application', 'apply', 'applyto', 'hello', 'world'],
      expected: ['apple', 'applet', 'application', 'apply', 'applyto', 'hello', 'world']
    },
    {
      input: ['cat', 'cats', 'catch', 'dog', 'doghouse', 'house'],
      expected: ['cat', 'cats', 'catch', 'dog', 'doghouse']
    }
  ];

  tests.map((case: Case) => {
    test('parsed node should not be null', () => {
      expect(removeSuffixes(case.input)).toEqual(case.expected);
    })
  });
});
