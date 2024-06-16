import { type Node } from './parser';
import { removeSuffixes } from './removeSuffix';

interface Structures {
  [key: string]: Node[];
}

// TODO ignore list like bold tag
export function traverseNodes(root: Node): Structures {
  const structures: Structures = {};
  // join nested children's tag names
  // and if the same nesting structure has found
  // push its node
  const traverse = (node: Node): string => {
    if (node.children.length == 0) {
      return node.value.name;
    }
    const childrenStructure = node.children
      .map((child: (Node)) => traverse(child))
      .join("/");

    const structure = `${node.value.name}[${childrenStructure}]`;
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

  // found nodes are multiple
  // and, it has the depth > 2
  // (if the depth is 2, the p>text, div>dext are treated as a repeats)
  const repeatedKeys = Object.keys(structures).filter(
    (key) => structures[key].length > 1
  ).filter(
    (key) => key.split('[').length > 2
  );
  // console.log('repeatedKeys', repeatedKeys);

  const deeperNodeDropped = removeSuffixes(repeatedKeys);
  // console.log('deeperNodeDropped', deeperNodeDropped);

  return deeperNodeDropped.map((key: string) => structures[key]);
}

const structureText = (node: Node): string => {
  // console.log(`node ${typeof node}`);
  // console.log(JSON.stringify(node));
  if (node.children.length == 0) { // text
    return `<${node.value.name}>${node.value.text.slice(0, 5) + '...'}</${node.value.name}>`;
  }

  const childrenString = node.children
    .map((child: Node) => structureText(child))
    .join("");
  return `<${node.value.name}>${childrenString}</${node.value.name}>`;
};

export function formatResponse(repeatedStructures: Node[][]): string {
  const formattedResponse = repeatedStructures
    .map((structure, index) => {
      const structureString = structure
        .map((e, i) => `${index + 1}-${i + 1}. ${structureText(e)}`)
        .join("\n");
      return `${index + 1}.
${structureString}`;
    })
    .join("\n");
  return formattedResponse;
}
