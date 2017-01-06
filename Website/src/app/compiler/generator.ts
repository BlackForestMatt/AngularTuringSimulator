/// <reference path="./parser.ts"/>

import {ASTNode} from "./parser";
/**
 * Generates the Machine code for the Turing machine simulator
 * by translating the AST from the parser.
 *
 * Turing Simulator Machine code is a two dimensional array containing:
 * index:
 *  0  : start state
 *  1  : blank symbol
 *  2  : end states
 *  3  : alphabet map
 *  4+ : transition functions
 *
 * states are mapped to top level array indexes
 * symbols are mapped to second level array indexes
 * this ensures an unambiguous result for each tupel (state, symbol)
 * the alphabet map is needed to map indexes back to characters
 * transition functions are a tripel := (next state, next symbol, move dir)
 */
export class Generator {
  private stateIndex;
  private alphIndex;
  private statePool: number;
  private alphPool: number;
  private TMScode: number[][];

  constructor() {
    this.stateIndex = {
      "start": 0,
      "blank": 1,
      "end": 2,
      "alph": 3
    };
    this.alphIndex = {};
    this.alphPool = 0;
    this.statePool = 4;
    this.TMScode = [];
  }

  /**
   * Gets the index of a state
   * generates a new index if undefined
   * @param name the state
   * @return state index
   */
  private getState(name: string): number {
    if (!this.stateIndex.hasOwnProperty(name)) {
      let n: number = this.statePool++;
      this.stateIndex[name] = n;
      this.extendRow(2, n + 1);
      this.TMScode.push([]);
    }
    return this.stateIndex[name];
  }

  /**
   * Gets the index of a char
   * generates a new index if undefined
   * @param char the character
   * @return char index
   */
  private getAlphShift(char: string): number {
    if (!this.alphIndex.hasOwnProperty(char)) {
      // If char doesnt exist, generate new mapping and save in header
      let shift: number = this.alphPool;
      this.alphPool += 3;
      this.extendRow(3, shift + 1);
      this.TMScode[3][shift] = char.charCodeAt(0);
      this.alphIndex[char] = shift;
    }
    return this.alphIndex[char];
  }

  /**
   * Maps direction symbol to position increment value
   * '>': 1, '<': -1, '-': 0
   * @param dir direction symbol
   * @return direction value
   */
  private getDirection(dir: string): number {
    if (dir === ">") {
      return 1;
    } else if (dir === "<") {
      return -1;
    }
    return 0;
  }

  /**
   * Sets the start state
   * @param state the start state
   */
  private setStart(state: string): void {
    let start: number = this.getState(state);
    this.TMScode[0] = [start];
  }

  /**
   * Sets the symbol to use as blank
   * @param blank the blank symbol
   */
  private setBlank(blank: string): void {
    let symbol: number = this.getAlphShift(blank);
    this.TMScode[1] = [symbol];
  }

  /**
   * Sets the end states
   * @param ends the end states
   */
  private setEnds(ends: string[]): void {
    for (let i = 0; i < ends.length; i++) {
      let end: number = this.getState(ends[i]);
      this.TMScode[2][end] = 1;
    }
  }

  /**
   * Increases row length of code row to match given size
   * Initializes row if undefined
   * @param index row to resize
   * @param size size to grow to
   */
  private extendRow(index: number, size: number): void {
    if (!this.TMScode[index]) {
      this.TMScode[index] = [];
    }
    let start: number = this.TMScode[index].length;
    for (; start < size; start++) {
      this.TMScode[index].push(0);
    }
  }

  /**
   * Adds a transition to the code
   * Error is thrown on transition already defined
   * Error is thrown on loop detection
   * @param from state to transit from
   * @param read symbol to transit on
   * @param to state to transit to
   * @param write symbol to write
   * @param move direction to move
   */
  private addTransition(from: string, read: string, to: string, write: string, move: string): void {
    let TMSfrom: number = this.getState(from);
    let TMSto: number = this.getState(to);
    let TMSread: number = this.getAlphShift(read);
    let TMSwrite: number = this.getAlphShift(write);
    let TMSdir: number = this.getDirection(move);
    if (TMSfrom === TMSto && TMSread === TMSwrite && TMSdir === 0) {
      throw new Error("Transition to self: (" + from + "," + read + ") -> (" + to + "," + write + "," + move + ")");
    }
    // Increase row size to fit function
    this.extendRow(TMSfrom, TMSread + 3);
    if (this.TMScode[TMSfrom][TMSread] !== 0) {
      throw new Error("Transition already defined: (" + from + "," + read + ")");
    } else {
      // set row values to functino args
      this.TMScode[TMSfrom][TMSread] = TMSto;
      this.TMScode[TMSfrom][TMSread + 1] = TMSwrite;
      this.TMScode[TMSfrom][TMSread + 2] = TMSdir;
    }
  }

  /**
   * Gets the state to number mapping of the generated code
   * @return State map
   */
  getStateMap() {
    return this.stateIndex;
  }

  /**
   * Generates Turing Machine Code from AST
   * @param AST the Abstract Syntax tree
   * @return two dimensional code array
   */
  generate(AST: ASTNode): number[][] {
    this.stateIndex = {
      "start": 0,
      "blank": 1,
      "end": 2,
      "alph": 3
    };
    this.alphIndex = {};
    this.statePool = 4;
    this.alphPool = 0;
    this.TMScode = [];
    this.TMScode[2] = [];
    let self = this;
    // Generate simulator code
    let functions = AST.getAll("FUNCTION");
    functions.forEach(function (fkt, index) {
      // Iterate over functions and add them to code
      let vals = fkt.children;
      self.addTransition(vals[0].data, vals[1].data, vals[2].data, vals[3].data, vals[4].data);
    });
    // Generate simulator settings
    let assignments = AST.getAll("ASSIGNMENT");
    assignments.forEach(function (item, index) {
      // Iterate over assignments and set code headers
      let vals = item.children;
      if (vals[0].data === "start") {
        self.setStart(vals[1].data);
      } else if (vals[0].data === "blank") {
        self.setBlank(vals[1].data);
      } else if (vals[0].data === "end") {
        let ends: string[] = [];
        for (let i = 1; i < vals.length; i++) {
          ends.push(vals[i].data);
        }
        self.setEnds(ends);
      }
    });
    return this.TMScode;
  }
}
