// deno-lint-ignore-file no-empty-interface
export type NodeType =
  | "Program"
  | "VarDeclaration"
  | "NumericLiteral"
  | "BinaryExpression"
  | "Identifier"
  | "AssignmentExpr"
export interface Stmt {
  kind: NodeType;
}

export interface Program extends Stmt {
  kind: "Program";
  body: Stmt[];
}

export interface VarDeclaration extends Stmt {
  kind: "VarDeclaration";
  constant: boolean;
  identifier: string;
  value?: Expr;
}



export interface Expr extends Stmt {}

export interface BinaryExpr extends Expr {
  kind: "BinaryExpression";
  left: Expr;
  right: Expr;
  operator: string;
}

export interface AssignmentExpr extends Expr {
  kind: "AssignmentExpr";
  assignee: Expr;
  value: Expr;
}

export interface Identifier extends Expr {
  kind: "Identifier";
  symbol: string;
}

export interface NumericLiteral extends Expr {
  kind: "NumericLiteral";
  value: number;
}
