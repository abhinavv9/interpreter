import {
  BinaryExpr,
  Expr,
  Identifier,
  NodeType,
  NumericLiteral,
  Stmt,
  Program,
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
    return this.parse_expr();
  }

  private parse_expr(): Expr {
    return this.parse_additive_expr();
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
    let left = this.parse_primary_expr();

    while (
      this.at().value == "*" ||
      this.at().value == "/" ||
      this.at().value == "%"
    ) {
      const operator = this.eat().value;
      const right = this.parse_primary_expr();
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
}
