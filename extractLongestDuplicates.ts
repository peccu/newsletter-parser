import { type Node } from './parser';

interface Structures {
  [key: string]: Node[];
}

export function traverseNodes(root: Node): Structures {
  const structures: Structures = {};
  // join nested children's tag names
  // and if the same nessting structure has found
  // push its node
  const traverse = (node: Node): string => {
    if (node.children.length == 0) {
      return node.name;
    }
    const structure = node.children
      .map((child: (Node | string)) => {
        if (typeof child === "object") {
          // child is Node
          return `${child.name}_${traverse(child)}`;
        }
        // child is text
        // return child;
        return "textnode";
      })
      .join("/");

    if (structures.hasOwnProperty(structure)) {
      structures[structure].push(node);
    } else {
      structures[structure] = [node];
    }
    return structure;
  };

  traverse(root);
  return structures;
}

export function detectRepeatedStructures(root: Node): Node[][] {
  const structures = traverseNodes(root);

  // console.log('found', structures);
  // console.log('found path', Object.keys(structures));
  // console.log('found structures', Object.values(structures));

  const repeatedKeys = Object.keys(structures).filter(
    (key) => structures[key].length > 1,
  );
  // console.log('repeatedKeys', repeatedKeys);

  const deeperNodeDropped = removeSuffixes(repeatedKeys);
  // console.log('deeperNodeDropped', deeperNodeDropped);

  return deeperNodeDropped.map((key: string) => structures[key]);
}

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

function removeSuffixes(arr: string[]): string[] {
  const patterns = findPatterns(arr);
  // console.log(`patterns ${JSON.stringify(Array.from(patterns))}`);
  const removedShorter = arr.filter((item) => !patterns.has(item));
  return removedShorter;
}

const structureText = (node: Node | string): string => {
  if (typeof node !== "object") { // text
    return node;
  }
  // console.log(`node ${typeof node}`);
  // console.log(JSON.stringify(node));
  if (node.children.length == 0) { // node
    return `<${node.name}></${node.name}>`;
  }

  const childrenString = node.children.map((child: Node | string) => structureText(child));
  return `<${node.name}>${childrenString}</${node.name}>`;
};

export function formatResponse(repeatedStructures: Node[][]): string {
  const formattedResponse = repeatedStructures
    .map((structure, index) => {
      const structureString = structure.map((e) => structureText(e)).join("||");
      return `${index + 1}. ${structureString}`;
    })
    .join("\n");
  return formattedResponse;
}

/*
const input1 = ['a', 'b', 'abc', 'bc', 'ab', 'dc', 'bd', 'eghu', 'yuh', 'ghu', 'hu', 'ft'];
console.log(input1);
console.log(removeSuffixes(input1));
// 出力: ['a', 'b', 'abc', 'ab', 'dc', 'bd', 'eghu', 'yuh', 'ft']

const input2 = ['apple', 'applet', 'application', 'apply', 'applyto', 'hello', 'world'];
console.log(input2);
console.log(removeSuffixes(input2));
// 出力: ['apple', 'applet', 'application', 'apply', 'applyto', 'hello', 'world']

const input3 = ['cat', 'cats', 'catch', 'dog', 'doghouse', 'house'];
console.log(input3);
console.log(removeSuffixes(input3));
// 出力: ['cat', 'catch', 'dog', 'doghouse', 'house']
*/
