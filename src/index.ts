import { parser, printNodeTree } from "./parser";
import { detectRepeatedStructures, formatResponse } from "./extractLongestDuplicates";

const process = (html: string): void => {
  console.log(
    "----------------------------------------------------------------",
  );
  // parse input HTML
  const root = parser(html);
  console.log("extracted elements: detectRepeatedStructures");
  // console.log(root);
  console.log(printNodeTree(root));

  // extract repeating structures
  const repeatedStructures = detectRepeatedStructures(root);
  console.log("repeated structures: detectRepeatedStructures");
  // console.log(repeatedStructures);
  // printNodeTree(repeatedStructures);

  // あとはaタグを抜き出すなりコンテンツのテキストだけ持ってきて
  // エンベッドしてにいれて評価点を返す、かな
  // という部分はdeta.spaceに置こうかな
  // フロントやな。フィードバックと既読。
  console.log(formatResponse(repeatedStructures));
}
export default process
