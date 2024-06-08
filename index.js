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
  let previousElement = null;

  for (const element of elements) {
    console.log('Checking element:', element); // 追加
    if (previousElement && isEquivalent(element, previousElement)) {
      console.log('  Equivalent to previous element'); // 追加
      if (!repeatingElements.length || isEquivalent(element, repeatingElements[0])) {
        console.log('  Adding to repeating elements'); // 追加
        repeatingElements.push(element);
      }
    } else {
      console.log('  Not equivalent to previous element'); // 追加
    }
    previousElement = element;
  }

  return repeatingElements;
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

function printElementsTree(elements, indent = 0) {
  elements.map(element => {
    console.log(' '.repeat(indent) + element.name);
    if (element.children.length > 0) {
      printElementsTree(element.children, indent + 2);
    }
  });
}

// 使用例
const html = `
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
`;

const repeatingElements = extractRepeatingElements(html);
console.log(repeatingElements);
