export enum TokenType {
  // Literal types
  Number,
  Identifier,

  // Grouping Operators
  Eqaual,
  Semicolon,
  OpenParen,
  CloseParen,
  BinaryOperator,
  Colon,
  OpenBrace,
  CloseBrace,
  OpenBracket,
  CloseBracket,
  Comma,
  EOF,

  // Keywords
  Let,
  Const,
}

const KEYWORDS: Record<string, TokenType> = {
  let: TokenType.Let,
  const: TokenType.Const,
};

export interface Token {
  value: string;
  type: TokenType;
}

function token(value = "", type: TokenType): Token {
  return { value, type };
}

function isAlpha(c: string): boolean {
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}

function isInt(c: string): boolean {
  return "0" <= c && c <= "9";
}

function isSkippable(c: string): boolean {
  return c == " " || c == "\n" || c == "\t" || c == "\r";
}

export function tokenize(source: string): Token[] {
  const tokens = new Array<Token>();
  const src = source.split("");

  while (src.length > 0) {
    if (src[0] == "(") {
      tokens.push(token(src.shift(), TokenType.OpenParen));
    } else if (src[0] == ")") {
      tokens.push(token(src.shift(), TokenType.CloseParen));
    } else if (src[0] == "{") {
      tokens.push(token(src.shift(), TokenType.OpenBrace));
    } else if (src[0] == "}") {
      tokens.push(token(src.shift(), TokenType.CloseBrace));
    } else if (src[0] == "[") {
      tokens.push(token(src.shift(), TokenType.OpenBracket));
    } else if (src[0] == "]") {
      tokens.push(token(src.shift(), TokenType.CloseBracket));
    } else if (src[0] == "=") {
      tokens.push(token(src.shift(), TokenType.Eqaual));
    } else if (src[0] == ";") {
      tokens.push(token(src.shift(), TokenType.Semicolon));
    } else if (src[0] == ",") {
      tokens.push(token(src.shift(), TokenType.Comma));
    } else if (src[0] == ":") {
      tokens.push(token(src.shift(), TokenType.Colon));
    } else if (
      src[0] == "+" ||
      src[0] == "-" ||
      src[0] == "*" ||
      src[0] == "/" ||
      src[0] == "%"
    ) {
      tokens.push(token(src.shift(), TokenType.BinaryOperator));
    } else {
      if (isInt(src[0])) {
        let value = "";
        while (isInt(src[0])) {
          value += src.shift();
        }
        tokens.push(token(value, TokenType.Number));
      } else if (isAlpha(src[0])) {
        let value = "";
        while (isAlpha(src[0])) {
          value += src.shift();
        }

        const reserved = KEYWORDS[value];
        if (typeof reserved == "number") {
          tokens.push(token(value, reserved));
        } else {
          tokens.push(token(value, TokenType.Identifier));
        }
      } else if (isSkippable(src[0])) {
        src.shift();
      } else {
        console.error(`Unexpected token: ${src[0]}`);
        Deno.exit(1);
      }
    }
  }

  tokens.push({ value: "EndOfFile", type: TokenType.EOF });
  return tokens;
}
