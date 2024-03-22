import { RuntimeVal } from "./values.ts";
import { Stmt, BinaryExpr, Program, Identifier, ObjectLiteral } from "../cmd/ast.ts";
import Environment from "./environment.ts";
import { VarDeclaration, AssignmentExpr } from "../cmd/ast.ts";
import {
  evaluateNumericLiteral,
  evaluateBinaryExpression,
  evaluateIdentifier,
  evaluateAssignmentExpression,
  evaluateObjectExpression,
} from "./eval/expression.ts";
import { evaluateProgram, evaluateVarDeclaration } from "./eval/statement.ts";

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
    case "VarDeclaration":
      return evaluateVarDeclaration(node as VarDeclaration, env);
      case "ObjectLiteral":
        return evaluateObjectExpression(node as ObjectLiteral, env);
    case "AssignmentExpr":
      return evaluateAssignmentExpression(node as AssignmentExpr, env);
    default:
      console.error("This AST Node has not yet been setup", node);
      Deno.exit(1);
  }
}
