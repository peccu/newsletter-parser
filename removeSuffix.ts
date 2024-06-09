function findPatterns(arr: string[]): Set<string> {
  const patterns = new Set<string>();
  arr.map((item, i) => {
    arr.map((suffix, j) => {
      if (i != j && item.endsWith(suffix)) {
        patterns.add(suffix);
      }
    });
  });
  return patterns;
}

export function removeSuffixes(arr: string[]): string[] {
  const patterns = findPatterns(arr);
  // console.log(`patterns ${JSON.stringify(Array.from(patterns))}`);
  const removedShorter = arr.filter((item) => !patterns.has(item));
  return removedShorter;
}
