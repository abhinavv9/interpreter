import { VarDeclaration, Program } from "../../cmd/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, MAKE_NULL } from "../values.ts";

export function evaluateVarDeclaration(
  node: VarDeclaration,
  env: Environment
): RuntimeVal {
  const value = node.value ? evaluate(node.value, env) : MAKE_NULL();
  return env.declareVar(node.identifier, value, node.constant);
}

export function evaluateProgram(node: Program, env: Environment): RuntimeVal {
  let result: RuntimeVal = MAKE_NULL();

  for (const stmt of node.body) {
    result = evaluate(stmt, env);
  }

  return result;
}
