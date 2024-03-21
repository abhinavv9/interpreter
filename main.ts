import Parser from "./cmd/parser.ts";
import Environment from "./runtime/environment.ts";
import { evaluate} from "./runtime/interpreter.ts";
import { MAKE_NUMBER, MAKE_BOOL, MAKE_NULL } from "./runtime/values.ts";

repl();

function repl() {
  const parser = new Parser();
  const env = new Environment();

  env.declareVar("true", MAKE_BOOL(true), true)
  env.declareVar("false", MAKE_BOOL(false), true)
  env.declareVar("null", MAKE_NULL(), true)

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
