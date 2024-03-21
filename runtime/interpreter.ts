import { RuntimeVal, ValueType, NumberVal } from "./values.ts";
import {
  Stmt,
  NumericLiteral,
  BinaryExpr,
  Program,
  Identifier,
} from "../cmd/ast.ts";
import Environment from "./environment.ts";
import { MAKE_NULL } from "./values.ts";

export function evaluate(node: Stmt, env: Environment): RuntimeVal {
  switch (node.kind) {
    case "Program":
      return evaluateProgram(node as Program, env);
    case "NumericLiteral":
      return evaluateNumericLiteral(node);
    case "BinaryExpression":
      return evaluateBinaryExpression(node as BinaryExpr, env);
    case "Identifier":
      return evaluateIdentifier(node as Identifier, env);
    default:
      console.error("This AST Node has not yet been setup", node)
	  Deno.exit(1)
  }
}


function evaluateNumericLiteral(node: Stmt): RuntimeVal {
  return { type: "number", value: (node as NumericLiteral).value } as NumberVal;
}

function evaluateProgram(node: Program, env: Environment): RuntimeVal {
  let result: RuntimeVal = MAKE_NULL();

  for (const stmt of node.body) {
    result = evaluate(stmt, env);
  }

  return result;
}

function evaluateIdentifier(ident: Identifier, env: Environment): RuntimeVal {
  return env.lookupVar(ident.symbol);
}

function evaluateBinaryExpression(node: BinaryExpr, env: Environment): RuntimeVal {
  const left = evaluate(node.left, env);
  const right = evaluate(node.right, env);
  const operator = node.operator;

  if (left.type == "number" && right.type == "number") {
    return evaluateNumericBinaryExpression(left as NumberVal, right as NumberVal, operator);
  }

  return MAKE_NULL();
}

function evaluateNumericBinaryExpression(
  left: NumberVal,
  right: NumberVal,
  operator: string,
): NumberVal {
  switch (operator) {
	case "+":
	  return { type: "number", value: left.value + right.value } as NumberVal;
	case "-":
	  return { type: "number", value: left.value - right.value } as NumberVal;
	case "*":
	  return { type: "number", value: left.value * right.value } as NumberVal;
	case "/":
		// Todo: Division by zero
	  return { type: "number", value: left.value / right.value } as NumberVal;
	case "%":
	  return { type: "number", value: left.value % right.value } as NumberVal;
	default:
	  throw new Error(`Unknown binary operator: ${operator}`);
  }
}