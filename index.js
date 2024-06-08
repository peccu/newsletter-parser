const htmlparser = require('htmlparser2');

function extractRepeatingElements(html) {
  const elements = [];
  const elementStack = [];

  const parser = new htmlparser.Parser({
    onopentag(name, attribs) {
      const element = { name, attribs, children: [] };
      if (elementStack.length > 0) {
        const parentElement = elementStack[elementStack.length - 1];
        parentElement.children.push(element);
      } else {
        elements.push(element);
      }
      elementStack.push(element);
    },
    ontext(text) {
      if (elementStack.length > 0) {
        const currentElement = elementStack[elementStack.length - 1];
        currentElement.text = (currentElement.text || '') + text;
      }
    },
    onclosetag(name) {
      const closedElement = elementStack.pop();
      if (closedElement.name !== name) {
        throw new Error('Invalid HTML: mismatched closing tag');
      }
    }
  }, { decodeEntities: true });

  parser.write(html);
  parser.end();

  const repeatingElements = findRepeatingElements(elements);
  console.log('extracted elements');
  console.log(elements);
  printElementsTree(elements);
  console.log('repeating elements');
  console.log(repeatingElements);
  return repeatingElements;
}

function findRepeatingElements(elements) {
  const repeatingElements = [];
  const seen = new WeakSet();

  for (const element of elements) {
    if (!seen.has(element) && !isEquivalentToAny(element, repeatingElements)) {
      repeatingElements.push(element);
      seen.add(element);
    }
  }

  return repeatingElements;
}

function isEquivalentToAny(element, elements) {
  return elements.some(e => isEquivalent(element, e));
}

function isEquivalent(a, b) {
  if (a.name !== b.name) {
    return false;
  }
  if (a.children.length !== b.children.length) {
    return false;
  }
  for (let i = 0; i < a.children.length; i++) {
    if (!isEquivalent(a.children[i], b.children[i])) {
      return false;
    }
  }
  return true;
}

const attrStr = (element) => {
  return Object.entries(element.attribs).length > 0
    ? ` ${JSON.stringify(element.attribs)}`
    : '';
};

const elmStr = (indent, elm) => {
  return `${' '.repeat(indent)}${elm.name}${attrStr(elm)}`;
};

function printElementsTree(elements, indent = 0) {
  elements.map(element => {
    console.log(elmStr(indent, element));
    if (element.children.length > 0) {
      printElementsTree(element.children, indent + 2);
    }
  });
}

// 使用例
const testmap = [];
testmap.push(`
<html>
  <body>
    <div>
      <p>Paragraph 1</p>
    </div>
    <div class="important">
      <p>Paragraph 2</p>
    </div>
    <div>
      <p>Paragraph 3</p>
    </div>
  </body>
</html>
`);

testmap.push(`
<html>
  <body>
    <div>
      <p>Paragraph 1</p>
      <div>
        <p>Nested paragraph 1</p>
      </div>
    </div>
    <div>
      <p>Paragraph 2</p>
      <div>
        <p>Nested paragraph 2</p>
      </div>
    </div>
  </body>
</html>
`);

// run
testmap.map(html => {
  const repeatingElements = extractRepeatingElements(html);
  console.log(repeatingElements);
});
