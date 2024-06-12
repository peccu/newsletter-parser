import util from "util";

export class TreeNode<T> {
  value: T;
  children: TreeNode<T>[];

  constructor(value: T, children: TreeNode<T>[] = []) {
    this.value = value;
    this.children = children;
  }
    [util.inspect.custom](_depth: number, _options: any): string {
    return "${this.value}";
  }
}

export class TreeUtils {
  static reduce<T, U>(node: TreeNode<T>, callback: (accumulator: U, value: T) => U, initialValue: U): U {
    let accumulator = initialValue;

    const reduceHelper = (node: TreeNode<T>, acc: U): U => {
      acc = callback(acc, node.value);
      node.children.map(child => {
        acc = reduceHelper(child, acc);
      })
      return acc;
    };

    return reduceHelper(node, accumulator);
  }

  static map<T, U>(node: TreeNode<T>, callback: (value: T) => U): TreeNode<U> {
    const newNodeValue = callback(node.value);
    const newChildren = node.children.map(child => this.map(child, callback));
    return new TreeNode(newNodeValue, newChildren);
  }

  static filter<T>(node: TreeNode<T>, predicate: (value: T) => boolean): TreeNode<T> | null {
    if (!predicate(node.value)) {
      return null;
    }

    const filteredChildren = node.children
      .map(child => this.filter(child, predicate))
      .filter(child => child !== null) as TreeNode<T>[];

    return new TreeNode(node.value, filteredChildren);
  }

  static find<T>(node: TreeNode<T>, predicate: (value: T) => boolean): TreeNode<T> | null {
    if (predicate(node.value)) {
      return node;
    }
    for (const child of node.children) {
      const result = this.find(child, predicate);
      if (result !== null) {
        return result;
      }
    }
    return null;
  }

  static height<T>(node: TreeNode<T>): number {
    if (node.children.length === 0) {
      return 0;
    }
    const childHeights = node.children.map(child => this.height(child));
    return Math.max(...childHeights) + 1;
  }

  // breadth first search
  static bfs<T>(node: TreeNode<T>): T[] {
    const result: T[] = [];
    const queue: TreeNode<T>[] = [node];

    while (queue.length > 0) {
      const currentNode = queue.shift()!;
      result.push(currentNode.value);
      queue.push(...currentNode.children);
    }
    return result;
  }

  // depth first search
  static dfs<T>(node: TreeNode<T>): T[] {
    const result: T[] = [];
    const dfsHelper = (node: TreeNode<T>) => {
      result.push(node.value);
      for (const child of node.children) {
        dfsHelper(child);
      }
    };
    dfsHelper(node);
    return result;
  }

  // overwrite tree
  // if predicate = true, add child to the node.children
  static addChildToTree<T>(node: TreeNode<T>, predicate: (value: T) => boolean, child: TreeNode<T>): boolean {
    if (predicate(node.value)) {
      node.children.push(child);
      return true;
    }
    for (const childNode of node.children) {
      if (this.addChildToTree(childNode, predicate, child)) {
        return true;
      }
    }
    return false;
  }

  // overwrite tree
  // if predicate = true, remove the child from the node.children
  static removeChildFromTree<T>(node: TreeNode<T>, predicate: (value: T) => boolean): boolean {
    const index = node.children.findIndex(child => predicate(child.value));
    if (index !== -1) {
      node.children.splice(index, 1);
      return true;
    }
    for (const childNode of node.children) {
      if (this.removeChildFromTree(childNode, predicate)) {
        return true;
      }
    }
    return false;
  }

  // create new tree
  // if predicate = true, add child to the node.children
  static addChild<T>(node: TreeNode<T>, predicate: (value: T) => boolean, child: TreeNode<T>): TreeNode<T> {
    if (predicate(node.value)) {
      return new TreeNode(node.value, [...node.children, child]);
    }
    const newChildren = node.children
      .map(childNode => this.addChild(childNode, predicate, child));
    return new TreeNode(node.value, newChildren);
  }

  // create new tree
  // if predicate = true, remove the child from the node.children
  static removeChild<T>(node: TreeNode<T>, predicate: (value: T) => boolean): TreeNode<T> | null {
    const newChildren = node.children
      .map(childNode => this.removeChild(childNode, predicate))
      .filter(Boolean) as TreeNode<T>[];
    return predicate(node.value)
      ? null                    // remove it with children
      : new TreeNode(node.value, newChildren);
  }

}
