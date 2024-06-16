import { type Node } from './parser';
import { removeSuffixes } from './removeSuffix';

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
      return node.value.name;
    }
    const structure = node.children
      .map((child: (Node)) => {
        if (child.children.length > 0) { // Node
          // child is Node
          return `${child.value.name}_${traverse(child)}`;
        }
        // child is text
        return child.value.name;
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
