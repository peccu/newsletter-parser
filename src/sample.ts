import parser from "./index";
import fs from "fs";

function processArgs(): string[] {
  const args: string[] = process.argv.slice(2);
  if(args.length == 0){
    console.error("USAGE: node sample.ts path/to/sample.html");
    process.exit(1);
  }
  return args;
}

const args: string[] = processArgs();
const html = fs.readFileSync(args[0], 'utf8').toString();
parser(html);
