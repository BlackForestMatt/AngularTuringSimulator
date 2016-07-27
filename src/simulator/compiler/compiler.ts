/// <reference path="./lexer.ts"/>
/// <reference path="./parser.ts"/>
/// <reference path="./generator.ts"/>

class Compiler {
  private lexer: Lexer;
  private parser: Parser;
  private generator: Generator;

  private tokens: Token[];
  private astree: ASTNode;
  private code: number[][];

  constructor() {
    this.lexer = new Lexer();
    this.parser = new Parser();
    this.generator = new Generator();
  }

  getTokens(): Token[] {
    return this.tokens;
  }

  getAST(): ASTNode {
    return this.astree;
  }

  compile(source: string): number[][] {
    this.tokens = this.lexer.tokenize(source);
    this.astree = this.parser.parse(this.tokens);
    this.code = this.generator.generate(this.astree);
    return this.code;
  }
}
