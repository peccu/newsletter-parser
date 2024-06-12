import { Parser } from 'htmlparser2';
import util from 'util';

export class Node {
  name: string;
  attribs: { [key: string]: string };
  children: Node[];
  text: string;

  constructor(name: string, attribs: { [key: string]: string } = {}) {
    this.name = name;
    this.attribs = attribs;
    this.children = [];
    this.text = '';
  }
  [util.inspect.custom](depth: number, options: any) {
    return printNode(this);
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
      const newNode = new Node('textnode');
      newNode.text = text.trim();
      currentNode.children.push(newNode);
    },
    onclosetag() {
      currentNode = stack.pop() as Node;
    },
  });

  parser.write(html);
  parser.end();
  return root;
}

const attrStr = (element: Node): string => {
  // console.log('debug: element:', element);
  // console.log('debug: element.attribs:', element.attribs);
  return Object.entries(element.attribs).length > 0
    ? ` ${JSON.stringify(element.attribs)}`
    : "";
};

const elmStr = (element: Node, indent: number): string => {
  if (element.children.length === 0) { // text
    return `${" ".repeat(indent)}"${element.text}"`;
  }
  // Node
  return `${" ".repeat(indent)}${element.name}${attrStr(element)}`;
};

const printNode = (element: Node, indent: number = 0): string => {
  const el = elmStr(element, indent) + "\n";
  if (element.children.length > 0) {
    return el + printNodeTree(element, indent + 2);
  }
  return el;
};

export function printNodeTree(elements: Node, indent: number = 0): string {
  // console.log(elements);
  return elements.children
    .map((element) => printNode(element, indent))
    .join("");
}
