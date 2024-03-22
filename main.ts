import Parser from "./cmd/parser.ts";
import Environment from "./runtime/environment.ts";
import { setupGlobalEnv } from "./runtime/environment.ts";
import { evaluate} from "./runtime/interpreter.ts";
import { MAKE_NUMBER, MAKE_BOOL, MAKE_NULL } from "./runtime/values.ts";

// repl();
run('./test.txt')

async function run(filename: string) {
  const parser = new Parser();
  const env =  setupGlobalEnv();

  const input = await Deno.readTextFile(filename);
  const program = parser.produceAst(input);
  const result = evaluate(program, env);
  console.log(result);
}

function repl() {
  const parser = new Parser();
   const env =  setupGlobalEnv();

  while (true) {
    const input = prompt(">> ");

    if (!input || input === "exit") {
      break;
    }
    const program = parser.produceAst(input);
    
    const result = evaluate(program, env);
    console.log(result);
  }
}
