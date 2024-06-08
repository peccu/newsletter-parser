const htmlparser = require('htmlparser2');

function extractRepeatingElements(html) {
  const elements = [];
  let currentElement = null;
  let previousElement = null;

  const parser = new htmlparser.Parser({
    onopentag(name, attribs) {
      const element = { name, attribs, children: [] };
      if (currentElement) {
        currentElement.children.push(element);
      } else {
        elements.push(element);
      }
      previousElement = currentElement;
      currentElement = element;
    },
    ontext(text) {
      if (currentElement) {
        currentElement.text = (currentElement.text || '') + text;
      }
    },
    onclosetag(name) {
      if (currentElement && currentElement.name === name) {
        currentElement = previousElement;
      }
    }
  }, { decodeEntities: true });

  parser.write(html);
  parser.end();

  const repeatingElements = findRepeatingElements(elements);
  return repeatingElements;
}

function findRepeatingElements(elements) {
  const repeatingElements = [];
  let previousElement = null;

  for (const element of elements) {
    if (previousElement && isEquivalent(element, previousElement)) {
      if (!repeatingElements.length || isEquivalent(element, repeatingElements[0])) {
        repeatingElements.push(element);
      }
    }
    previousElement = element;
  }

  return repeatingElements;
}

function isEquivalent(a, b) {
  if (a.name !== b.name || a.attribs.length !== b.attribs.length) {
    return false;
  }
  for (const key in a.attribs) {
    if (a.attribs[key] !== b.attribs[key]) {
      return false;
    }
  }
  if (a.text !== b.text) {
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
