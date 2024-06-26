import {
  BinaryExpr,
  Expr,
  Identifier,
  NumericLiteral,
  Stmt,
  Program,
  VarDeclaration,
  AssignmentExpr,
  Property,
  ObjectLiteral,
  CallExpr,
  MemberExpr,
} from "./ast.ts";
import { tokenize, Token, TokenType } from "./lexer.ts";

export default class Parser {
  private tokens: Token[] = [];

  private at() {
    return this.tokens[0] as Token;
  }

  private eat() {
    const prev = this.tokens.shift() as Token;
    return prev;
  }

  private expects(type: TokenType, err: string) {
    const prev = this.tokens.shift() as Token;
    if (!prev || prev.type !== type) {
      console.error(err);
      Deno.exit(1);
    }

    return prev;
  }

  private not_eof(): boolean {
    return this.tokens[0].type !== TokenType.EOF;
  }

  public produceAst(sourceCode: string): Program {
    this.tokens = tokenize(sourceCode);

    const program: Program = {
      kind: "Program",
      body: [],
    };

    while (this.not_eof()) {
      program.body.push(this.parse_stmt());
    }

    return program;
  }

  private parse_stmt(): Stmt {
    switch (this.at().type) {
      case TokenType.Let:
        return this.parse_var_declaration();
      case TokenType.Const:
        return this.parse_var_declaration();
      default:
        return this.parse_expr();
    }
  }

  private parse_var_declaration(): Stmt {
    const isConst = this.eat().type == TokenType.Const;
    const identifier = this.expects(
      TokenType.Identifier,
      "Expected identifier let | const keyword"
    ).value;

    if (this.at().type == TokenType.Semicolon) {
      this.eat();
      if (isConst) {
        throw new Error("Constant declaration must have a value");
      }

      return {
        kind: "VarDeclaration",
        identifier,
        constant: false,
      } as VarDeclaration;
    }

    this.expects(TokenType.Eqaual, "Expected '=' after identifier");
    const declaration: VarDeclaration = {
      kind: "VarDeclaration",
      identifier,
      constant: isConst,
      value: this.parse_expr(),
    };

    this.expects(TokenType.Semicolon, "Expected ';' after expression");

    return declaration;
  }

  private parse_expr(): Expr {
    return this.parse_assigment_expr();
  }

  private parse_assigment_expr(): Expr {
    const left = this.parse_object_expr();
    if (this.at().type == TokenType.Eqaual) {
      this.eat();
      const right = this.parse_expr();
      return {
        kind: "AssignmentExpr",
        assignee: left,
        value: right,
      } as AssignmentExpr;
    }

    return left;
  }

  private parse_object_expr(): Expr {
    if (this.at().type !== TokenType.OpenBrace) {
      return this.parse_additive_expr();
    }
    this.eat();
    const properties = new Array<Property>();

    while (this.not_eof() && this.at().type != TokenType.CloseBrace) {
      const key = this.expects(
        TokenType.Identifier,
        "Expected identifier"
      ).value;

      // shorthand for same key value pair -> key: value -> key where key = value
      if (this.at().type == TokenType.Comma) {
        this.eat();
        properties.push({ kind: "Property", key } as Property);
        continue;
      } else if (this.at().type == TokenType.CloseBrace) {
        properties.push({ kind: "Property", key } as Property);
        continue;
      }

      this.expects(TokenType.Colon, "Expected ':'");
      const value = this.parse_expr();
      properties.push({ kind: "Property", key, value });
      if (this.at().type == TokenType.Comma) {
        this.eat();
      }
    }
    this.expects(TokenType.CloseBrace, "Expected '}'");
    return { kind: "ObjectLiteral", properties } as ObjectLiteral;
  }

  private parse_additive_expr(): Expr {
    let left = this.parse_multiplicative_expr();

    while (this.at().value == "+" || this.at().value == "-") {
      const operator = this.eat().value;
      const right = this.parse_multiplicative_expr();
      left = { kind: "BinaryExpression", left, right, operator } as BinaryExpr;
    }

    return left;
  }

  private parse_multiplicative_expr(): Expr {
    let left = this.parse_call_member_expr();

    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_call_member_expr();
      left = { kind: "BinaryExpression", left, right, operator } as BinaryExpr;
    }

    return left;
  }

  private parse_primary_expr(): Expr {
    const tk = this.at().type;

    switch (tk) {
      case TokenType.Number:
        return {
          kind: "NumericLiteral",
          value: parseFloat(this.eat().value),
        } as NumericLiteral;
      case TokenType.Identifier:
        return { kind: "Identifier", symbol: this.eat().value } as Identifier;
      case TokenType.OpenParen: {
        this.eat();
        const value = this.parse_expr();
        this.expects(
          TokenType.CloseParen,
          "Unmatched token found, expected ')'"
        );
        return value;
      }
      case TokenType.CloseParen:
      case TokenType.Eqaual:
      case TokenType.BinaryOperator:
      case TokenType.EOF:
      case TokenType.Let:
      default:
        console.error("Unexpected token", this.at());
        Deno.exit(1);
    }
  }

  private parse_call_member_expr(): Expr {
    const member = this.parse_call_member_expr();

    if (this.at().type == TokenType.OpenParen) {
      return this.parse_call_expr(member);
    }

    return member;
  }

  private parse_call_expr(caller: Expr): Expr {
    let call_expr: Expr = {
      kind: "CallExpr",
      caller,
      args: this.parse_args(),
    } as CallExpr;

    if (this.at().type == TokenType.CloseParen) {
      call_expr = this.parse_call_expr(call_expr);
    }

    return call_expr;
  }

  private parse_args(): Expr[] {
    this.expects(TokenType.OpenParen, "Expected '('");
    const args =
      this.at().type == TokenType.CloseParen ? [] : this.parse_arguments_list();

    this.expects(TokenType.CloseParen, "Expected ')'");
    return args;
  }

  private parse_arguments_list(): Expr[] {
    const args = [this.parse_assigment_expr()];

    while (this.at().type == TokenType.Comma) {
      this.eat();
      args.push(this.parse_assigment_expr());
    }

    return args;
  }
}
