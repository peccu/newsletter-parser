import { describe, expect, test } from '@jest/globals';

import { TreeNode, TreeUtils } from "../../src/treeNode";

const root = new TreeNode<number>(1, [
  new TreeNode(2, [
    new TreeNode(4),
    new TreeNode(5)
  ]),
  new TreeNode(3, [
    new TreeNode(6),
    new TreeNode(7)
  ])
]);

describe('test treeNode.ts', () => {

  // reduce
  test('TreeUtils.reduce sums all node values', () => {
    const sum = TreeUtils.reduce(root, (acc: number, value: number) => acc + value, 0);
    expect(sum).toBe(28);
  });

  // map
  test('TreeUtils.map doubles all node values', () => {
    const doubledTree = TreeUtils.map(root, (value: number) => value * 2);
    expect(doubledTree.value).toBe(2);
    expect(doubledTree.children[0].value).toBe(4);
    expect(doubledTree.children[0].children[0].value).toBe(8);
    expect(doubledTree.children[0].children[1].value).toBe(10);
    expect(doubledTree.children[1].value).toBe(6);
    expect(doubledTree.children[1].children[0].value).toBe(12);
    expect(doubledTree.children[1].children[1].value).toBe(14);
  });

  // filter
  test('TreeUtils.filter retains only odd values', () => {
    const oddTree = TreeUtils.filter(root, (value: number) => value % 2 === 1);
    expect(oddTree?.value).toBe(1);
    expect(oddTree?.value).toBe(1);
    expect(oddTree?.children.length).toBe(1);
    expect(oddTree?.children[0].value).toBe(3);
    expect(oddTree?.children[0].children.length).toBe(1);
    expect(oddTree?.children[0].children[0].value).toBe(7);

  });

  // filter
  test('TreeUtils.filter retains only even values equal whole tree are removed', () => {
    const evenTree = TreeUtils.filter(root, (value: number) => value % 2 === 0);
    expect(evenTree).toBe(null);
  });

  // filter
  test('TreeUtils.filter retains only even values', () => {
    const evenRoot = new TreeNode<number>(2, [
      new TreeNode(3, [
        new TreeNode(5),
        new TreeNode(6)
      ]),
      new TreeNode(4, [
        new TreeNode(7),
        new TreeNode(8)
      ])
    ]);
    const evenTree2 = TreeUtils.filter(evenRoot, (value: number) => value % 2 === 0);
    expect(evenTree2?.value).toBe(2);
    expect(evenTree2?.children.length).toBe(1);
    expect(evenTree2?.children[0].value).toBe(4);
    expect(evenTree2?.children[0].children.length).toBe(1);
    expect(evenTree2?.children[0].children[0].value).toBe(8);
  });

  // find
  test('TreeUtils.find locates node with value 5', () => {
    const foundNode = TreeUtils.find(root, (value: number) => value === 5);
    expect(foundNode).not.toBeNull();
    expect(foundNode?.value).toBe(5);
  });

  // height
  test('TreeUtils.height calculates the height of the tree', () => {
    const treeHeight = TreeUtils.height(root);
    expect(treeHeight).toBe(2);
  });

  // breadth first search
  test('TreeUtils.bfs traverses the tree in breadth-first order', () => {
    const bfsResult = TreeUtils.bfs(root);
    expect(bfsResult).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  // depth first search
  test('TreeUtils.dfs traverses the tree in depth-first order', () => {
    const dfsResult = TreeUtils.dfs(root);
    expect(dfsResult).toEqual([1, 2, 4, 5, 3, 6, 7]);
  });

  // add child overwrite
  test('TreeUtils.addChildToTree returns a true and original tree is overwritten with added child node', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // console.log(JSON.stringify(originalRoot, null, 2));
    const newChild = new TreeNode(8);
    const result1 = TreeUtils.addChildToTree(originalRoot, (value: number) => value === 2, newChild);
    // console.log(JSON.stringify(originalRoot, null, 2));
    expect(result1).toBe(true);
    expect(originalRoot.children[0].children.length).toBe(3);
    expect(originalRoot.children[0].children[2].value).toBe(8);
  });

  // add child overwrite
  test('TreeUtils.addChildToTree returns a null because insert target node does not found', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // target node not found
    const newChild = new TreeNode(8);
    const result2 = TreeUtils.addChildToTree(originalRoot, (value: number) => value === 10, newChild);
    expect(result2).toBe(false);
  });

  // remove child overwrite
  test('TreeUtils.removeChildFromTree returns a true and original tree is overwritten with removed child node', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // console.log(JSON.stringify(originalRoot, null, 2));
    const result1 = TreeUtils.removeChildFromTree(originalRoot, (value: number) => value === 5);
    // console.log(JSON.stringify(originalRoot, null, 2));
    expect(result1).toBe(true);
    expect(originalRoot.children[0].children.length).toBe(1);
    expect(originalRoot.children[0].children[0].value).toBe(4);
  });

  // remove child overwrite
  test('TreeUtils.removeChildFromTree returns a false because remove target node does not found', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // target node not found
    const result2 = TreeUtils.removeChildFromTree(originalRoot, (value: number) => value === 10);
    expect(result2).toBe(false);
  });

  // add child new tree
  test('TreeUtils.addChild modifies the original tree by adding a new child node', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    const newChild = new TreeNode(8);
    const newRoot = TreeUtils.addChild(originalRoot, (value: number) => value === 2, newChild);
    expect(originalRoot.children[0].children.length).toBe(2);
    expect(newRoot.children[0].children.length).toBe(3);
    expect(newRoot.children[0].children[2].value).toBe(8);
  });

  // add child new tree
  test('TreeUtils.addChild not modifies the original tree because insert target node does not found', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    const newChild = new TreeNode(8);
    const newRoot = TreeUtils.addChild(originalRoot, (value: number) => value === 10, newChild);
    expect(originalRoot.children[0].children.length).toBe(2);
    expect(newRoot.children[0].children.length).toBe(2);
    expect(newRoot.children[0].children[1].value).toBe(5);
  });

  // remove child new tree
  test('TreeUtils.removeChild modifies the original tree by removing a leaf node', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // console.log(JSON.stringify(originalRoot, null, 2));

    // remove leaf
    const newRoot = TreeUtils.removeChild(originalRoot, (value: number) => value === 5);
    // console.log(JSON.stringify(newRoot, null, 2));
    expect(originalRoot.children[0].children.length).toBe(2);
    expect(originalRoot.children[0].children[0].value).toBe(4);
    expect(originalRoot.children[0].children[1].value).toBe(5);
    expect(newRoot?.children[0].children.length).toBe(1);
    expect(newRoot?.children[0].children[0].value).toBe(4);
  });

  // remove child new tree
  test('TreeUtils.removeChild modifies the original tree by removing a child node', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // console.log(JSON.stringify(originalRoot, null, 2));

    // remove node (has leaves)
    const newRoot2 = TreeUtils.removeChild(originalRoot, (value: number) => value === 2);
    // console.log(JSON.stringify(newRoot2, null, 2));
    expect(originalRoot.children[0].children.length).toBe(2);
    expect(originalRoot.children[0].children[0].value).toBe(4);
    expect(originalRoot.children[0].children[1].value).toBe(5);
    expect(newRoot2?.children[0].children.length).toBe(2);
    expect(newRoot2?.children[0].children[0].value).toBe(6);
  });

  // remove child new tree
  test('TreeUtils.removeChild not modifies the original tree because remove target node does not found', () => {
    const originalRoot = new TreeNode(1, [
      new TreeNode(2, [
        new TreeNode(4),
        new TreeNode(5)
      ]),
      new TreeNode(3, [
        new TreeNode(6),
        new TreeNode(7)
      ])
    ]);
    // console.log(JSON.stringify(originalRoot, null, 2));

    // remove node (has leaves)
    const newRoot2 = TreeUtils.removeChild(originalRoot, (value: number) => value === 10);
    // console.log(JSON.stringify(newRoot2, null, 2));
    expect(originalRoot.children[0].children.length).toBe(2);
    expect(originalRoot.children[0].children[0].value).toBe(4);
    expect(originalRoot.children[0].children[1].value).toBe(5);
    expect(newRoot2?.children.length).toBe(2);
    expect(newRoot2?.children[0].children.length).toBe(2);
    expect(newRoot2?.children[0].children[0].value).toBe(4);
    expect(newRoot2?.children[0].children[1].value).toBe(5);
    expect(newRoot2?.children[1].children.length).toBe(2);
    expect(newRoot2?.children[1].children[0].value).toBe(6);
    expect(newRoot2?.children[1].children[1].value).toBe(7);
  });

});
