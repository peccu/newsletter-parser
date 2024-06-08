const htmlparser = require('htmlparser2');

function extractLinks(html) {
  const links = [];
  const parser = new htmlparser.Parser({
    onopentag(name, attribs) {
      if (name === 'a' && attribs.href) {
        links.push(attribs.href);
      }
    }
  }, {decodeEntities: true});

  parser.write(html);
  parser.end();

  return links;
}

// 使用例
const html = `
<html>
  <body>
    <a href="https://example.com/article1">Article 1</a>
    <p>Some text</p>
    <a href="https://example.com/article2">Article 2</a>
  </body>
</html>
`;

const links = extractLinks(html);
console.log(links);
