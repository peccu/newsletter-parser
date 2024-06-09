import { parser, printNodeTree } from "./parser.js";
// import { detectRepeatedStructures } from 'parser.js';
import { detectRepeatedStructures, formatResponse } from "./extractLongestDuplicates.js";

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

testmap.push(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Document</title>
  </head>
  <body>
    <header>
      <div>
        this is title
      </div>
    </header>
    <main>
      <div>
        <p>this is articlelist. feel free to read each articles</p>
      </div>
      <div>
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
      </div>
    </main>
    <footer>
      copyright your name
    </footer>
  </body>
</html>`);

// run
testmap.map((html) => {
  console.log(
    "----------------------------------------------------------------",
  );
  const root = parser(html);

  console.log("extracted elements: detectRepeatedStructures");
  // console.log(root);
  printNodeTree(root);
  const repeatedStructures = detectRepeatedStructures(root);
  console.log("repeated structures: detectRepeatedStructures");
  // console.log(repeatedStructures);
  // printNodeTree(repeatedStructures);

  // あとはaタグを抜き出すなりコンテンツのテキストだけ持ってきて
  // エンベッドしてにいれて評価点を返す、かな
  // という部分はdeta.spaceに置こうかな
  // フロントやな。フィードバックと既読。
  console.log(formatResponse(repeatedStructures));
});
