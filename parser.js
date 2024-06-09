import { Parser } from 'htmlparser2';

export class Node {
  constructor(name, attribs = {}) {
    this.name = name;
    this.attribs = attribs;
    this.children = [];
    this.text = '';
  }
}

export function parser(html) {
  const root = new Node("root");
  let currentNode = root;
  const stack = [];

  const parser = new Parser({
    onopentag(name, attribs) {
      const newNode = new Node(name, attribs);
      currentNode.children.push(newNode);
      stack.push(currentNode);
      currentNode = newNode;
    },
    ontext(text) {
      // Ignore whitespace and line breaks
      if (!text.trim()) return;
      currentNode.children.push(text.trim());
    },
    onclosetag() {
      currentNode = stack.pop();
    },
  });

  parser.write(html);
  parser.end();
  return root;
}

const attrStr = (element) => {
  // console.log('debug: element:', element);
  // console.log('debug: element.attribs:', element.attribs);
  if (typeof element !== "object") { // text
    return element;
  }
  // Node
  return Object.entries(element.attribs).length > 0
    ? ` ${JSON.stringify(element.attribs)}`
    : "";
};

const elmStr = (indent, element) => {
  if (typeof element !== "object") { // text
    return `${" ".repeat(indent)}"${element}"`;
  }
  // Node
  return `${" ".repeat(indent)}${element.name}${attrStr(element)}`;
};

export function printNodeTree(elements, indent = 0) {
  // console.log(elements);
  elements.children.map((element) => {
    console.log(elmStr(indent, element));
    if (typeof element === "object" && element.children.length > 0) {
      printNodeTree(element, indent + 2);
    }
  });
}
