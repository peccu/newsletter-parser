const htmlparser = require('htmlparser2');

function extractElements(html, tagName) {
  const elements = [];
  const parser = new htmlparser.Parser({
    onopentag(name, attribs) {
      if (name === tagName) {
        elements.push({ name, attribs });
      }
    },
    onclosetag(name) {
      if (name === tagName) {
        elements[elements.length - 1].closeTag = true;
      }
    }
  }, { decodeEntities: true });

  parser.write(html);
  parser.end();

  return elements;
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

const divElements = extractElements(html, 'div');
console.log(divElements);
