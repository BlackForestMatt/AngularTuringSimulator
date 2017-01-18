/**
 * Created by josef on 1/18/17.
 */
/// <reference path="./lexer.ts"/>
/// <reference path="./parser.ts"/>
/// <reference path="./generator.ts"/>

import {Lexer, Token} from "./lexer";
import {Parser, ASTNode} from "./parser";
import {Generator} from "./generator";
/**
 * Turing Machine Simulator Compiler
 * Compiles Turing machine definitions into code runnable by the
 * Turing Machine simulator
 */
export class Compiler {
  private alphabet: string[] = [
    "start",
    "blank",
    "end",
    ":=",
    "->",
    ",",
    ";",
    "{",
    "}",
    "-",
    "<",
    ">",
  ];

  private lexer: Lexer;
  private parser: Parser;
  private generator: Generator;

  private tokens: Token[];
  private astree: ASTNode;
  private code: number[][];

  /**
   * Constructor initializes compiler components
   */
  constructor() {
    this.lexer = new Lexer(this.alphabet);
    this.parser = new Parser();
    this.generator = new Generator();
  }

  /**
   * Gets the tokens generated during compilation
   * @return tokenized code
   */
  getTokens(): Token[] {
    return this.tokens;
  }

  /**
   * Gets Abstract syntax tree generated during compilation
   * @return syntax tree
   */
  getAST(): ASTNode {
    return this.astree;
  }

  /**
   * Gets the state mapping of the generator
   * @return State map
   */
  getStateMap() {
    return this.generator.getStateMap();
  }

  /**
   * Compiles source code to Turing executable
   * @param source The sourcecode to compile
   * @return the Turing executable code
   */
  compile(source: string): number[][] {
    // Break code into tokenz defined by alphabet
    this.tokens = this.lexer.tokenize(source);
    // Parse tokens into an Abstract syntax tree
    this.astree = this.parser.parse(this.tokens);
    // Generate Turing Simulator executable code
    this.code = this.generator.generate(this.astree);
    return this.code;
  }
}
