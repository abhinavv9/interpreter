// deno-lint-ignore-file no-empty-interface
export type NodeType =
  | "Program"
  | "VarDeclaration"
  | "NumericLiteral"
  | "BinaryExpression"
  | "Identifier"
  | "AssignmentExpr"
  | "Property"
  | "ObjectLiteral"
  | "MemberExpr"
  | "CallExpr";
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

export interface MemberExpr extends Expr {
  kind: "MemberExpr";
  object: Expr;
  property: Expr;
  computed: boolean;
}

export interface CallExpr extends Expr {
  kind: "CallExpr";
  args: Expr[];
  caller: Expr;
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

export interface ObjectLiteral extends Expr {
  kind: "ObjectLiteral";
  properties: Property[];
}

export interface Property extends Expr {
  kind: "Property";
  key: string;
  value?: Expr;
}
