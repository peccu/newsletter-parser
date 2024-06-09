import { Parser } from 'htmlparser2';

export class Node {
  name: string;
  attribs: { [key: string]: string };
  children: (Node | string)[];
  text: string;

  constructor(name: string, attribs: { [key: string]: string } = {}) {
    this.name = name;
    this.attribs = attribs;
    this.children = [];
    this.text = '';
  }
}

export function parser(html: string): Node {
  const root = new Node("root");
  let currentNode = root;
  const stack: Node[] = [];

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
      currentNode = stack.pop() as Node;
    },
  });

  parser.write(html);
  parser.end();
  return root;
}

const attrStr = (element: Node | string): string => {
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

const elmStr = (indent: number, element: Node | string): string => {
  if (typeof element !== "object") { // text
    return `${" ".repeat(indent)}"${element}"`;
  }
  // Node
  return `${" ".repeat(indent)}${element.name}${attrStr(element)}`;
};

export function printNodeTree(elements: Node, indent: number = 0): void {
  // console.log(elements);
  elements.children.map((element) => {
    console.log(elmStr(indent, element));
    if (typeof element === "object" && element.children.length > 0) {
      printNodeTree(element, indent + 2);
    }
  });
}