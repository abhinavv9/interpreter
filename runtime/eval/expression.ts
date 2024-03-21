import { Stmt, NumericLiteral, Identifier, BinaryExpr } from "../../cmd/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { RuntimeVal, NumberVal, MAKE_NULL } from "../values.ts";

export function evaluateNumericLiteral(node: Stmt): RuntimeVal {
  return { type: "number", value: (node as NumericLiteral).value } as NumberVal;
}

export function evaluateIdentifier(ident: Identifier, env: Environment): RuntimeVal {
  return env.lookupVar(ident.symbol);
}

export function evaluateBinaryExpression(node: BinaryExpr, env: Environment): RuntimeVal {
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