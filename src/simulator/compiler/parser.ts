/// <reference path="./lexer.ts"/>

class ParseStack {
  private stack: string[];
  constructor() {
    this.stack = [];
  }

  pop(): string {
    return this.stack.pop();
  }

  push(content: any): void {
    if (typeof content === "string") {
      this.stack.push(content);
    } else if (typeof content === "object" && content.length) {
      // Copy array before reversing to prevent parsetable entry from reversing
      content = content.slice(0);
      this.stack = this.stack.concat(content.reverse());
    } else {
      throw new Error("Cannont push " + typeof content);
    }
  }

  head(): string {
    return this.stack[this.stack.length - 1];
  }

  isEmpty(): boolean {
    return this.stack.length === 0;
  }
}

class ParseTable {
  private static table = {
    "STATEMENT": {
      "start": ["ASSIGNMENT", ";", "STATEMENT"],
      "end": ["ASSIGNMENT", ";", "STATEMENT"],
      "blank": ["ASSIGNMENT", ";", "STATEMENT"],
      "z": ["FUNCTION", ";", "STATEMENT"],
      "$": "eps"
    },
    "FUNCTION": {
      "z": ["z", ",", "v", "->", "z", ",", "v", ",", "DIRECTION"]
    },
    "ASSIGNMENT": {
      "start": ["start", ":=", "z"],
      "end": ["end", ":=", "{", "z", "X2", "}"],
      "blank": ["blank", ":=", "v"]
    },
    "X2": {
      ",": [",", "z", "X2"],
      "}": "eps"
    },
    "DIRECTION": {
      "<": ["<"],
      ">": [">"],
      "-": ["-"]
    }
  };
  constructor() {

  }

  getExpansions(variable: string): string {
    return ParseTable.table[variable];
  }

  get(variable: string, input: Token): any {
    let expansions = this.getExpansions(variable);
    let expansion;
    if (expansions) {
      if (input.type === "IDENTIFIER") {
        expansion = expansions["z"];
      } else {
        expansion = expansions[input.value];
      }
    }
    return expansion;
  }

  isNonTerminal(item: string): boolean {
    return this.getExpansions(item) !== null;
  }

}

class ASTNode {
  data: string;
  parent: ASTNode;
  children: ASTNode[];

  constructor(data: string) {
    this.data = data;
    this.children = [];
    this.parent = null;
  }

  public add(data: any): ASTNode {
    let node: ASTNode;
    let first: ASTNode;
    if (typeof data === "string") {
      first = new ASTNode(data);
      first.parent = this;
      this.children.push(first);
    } else if (typeof data === "object" && data.length >= 0) {
      for (let i = 0; i < data.length; i++) {
        node = new ASTNode(data[i]);
        node.parent = this;
        this.children.push(node);
        if (i === 0) {
          first = node;
        }
      }
    } else {
      throw new Error("Cannot add " + typeof data + "to AST");
    }
    return first;
  }

  private traverse(callback: (ASTNode) => void): void {
    (function trav(elem: ASTNode) {
      for (let i = 0; i < elem.children.length; i++) {
        trav(elem.children[i]);
      }
      callback(elem);
    })(this);
  }

  public print(): void {
    let depth: number = 0;
    (function prt(elem: ASTNode) {
      depth++;
      elem.children.forEach(function (item, index) {
        console.log(Array(depth).join(" ") + "|- " + item.data);
        prt(item);
      });
      depth--;
    })(this);
  }

  public remove(data: string): ASTNode {
    let node: ASTNode;
    this.traverse(function (elem: ASTNode) {
      for (let i = 0; i < elem.children.length; i++) {
        if (!node && elem.children[i].data === data) {
          elem.children.splice(i, 1)[0];
          node = elem;
        }
      }
    });
    return node;
  }

  public findEmpty(data: string): ASTNode {
    let node: ASTNode;
    this.traverse(function (elem: ASTNode) {
      if (!node && elem.data === data && elem.children.length === 0) {
        node = elem;
      }
    });
    return node;
  }

  public getAll(data: string): ASTNode[] {
    let nodes: ASTNode[] = [];
    this.traverse(function (elem: ASTNode) {
      if (elem.data === data) {
        nodes.push(elem);
      }
    });
    return nodes;
  }
}

class Parser {
  private parseTable: ParseTable;
  private parseStack: ParseStack;
  private AST: ASTNode;
  private pos: number;

  constructor() {
    this.parseTable = new ParseTable();
  }

  parse(tokens: Token[]): ASTNode {
    // Create the base node of the abstract syntax tree.
    // Create and initialize the parser stack.
    // Initialize input pointer position.
    let ASTPos: ASTNode;
    this.AST = new ASTNode("BASE");
    this.AST.add("STATEMENT");
    this.parseStack = new ParseStack();
    this.parseStack.push(["STATEMENT", "$"]);
    this.pos = 0;
    while (!this.parseStack.isEmpty()) {
      let input: Token = tokens[this.pos];
      let head: string = this.parseStack.head();
      let expansion = this.parseTable.get(head, input);
      if (expansion) {
        // If the replacement is an epsilon just remove stack head.
        // Find the leftmost non-terminal in the AST.
        // If expansion is a sigle symbol replace current node in AST
        // to flatten unneeded nodes.
        this.parseStack.pop();
        if (expansion !== "eps") {
          ASTPos = this.AST.findEmpty(head);
          if (ASTPos) {
            let expanded: string[] = expansion.slice(0);
            if (head === "STATEMENT") {
              // If current replacement is a statement
              // then replace it with contents to flatten tree
              ASTPos.parent.remove("STATEMENT");
              ASTPos = ASTPos.parent;
              expanded = [
                expanded[0],
                expanded[2]
              ];
            } else if (head === "ASSIGNMENT") {
              // If current replacement is an assignment
              // then remove unneeded commas for simplification
              if (expanded[0] === "end") {
                expanded = [
                  expanded[0],
                  expanded[3],
                  expanded[4]
                ];
              } else {
                expanded = [
                  expanded[0],
                  expanded[2]
                ];
              }
            } else if (head === "X2") {
              // If current replacement is the temporary variable X2
              // remove it and replace with content
              ASTPos.parent.remove("X2");
              ASTPos = ASTPos.parent;
              expanded = [
                expanded[1],
                expanded[2]
              ];
            } else if (head === "FUNCTION") {
              // If the current replacement is a function
              // remove unneeded commas for simplification
              expanded = [
                expanded[0],
                expanded[2],
                expanded[4],
                expanded[6],
                expanded[8]
              ];
            } else if (head === "DIRECTION") {
              // If current replacement is a direction
              // replace is with its value
              ASTPos.data = expanded[0];
              expanded = [];
            }
            // add the modified expansion to the AST
            // and the original to the parse stack
            ASTPos.add(expanded);
            this.parseStack.push(expansion);
          }
        } else {
          this.AST.remove(head);
        }
      } else {
        // If there is no expansion head must be a terminal.
        // head is compared to input if input doesn't match an Error is thrown.
        // Current node in AST is replaced by terminal
        let type: string = null;
        ASTPos = this.AST.findEmpty(head);
        if (head === input.value ||
           (head === "z" && input.type === "IDENTIFIER") ||
           (head === "v" && input.type === "IDENTIFIER" && input.value.length === 1)) {
          if (ASTPos) {
            ASTPos.data = input.value;
          }
          this.parseStack.pop();
          this.pos++;
        } else {
          if (head === "z") {
            throw new SyntaxError("Expected a state but instead saw: '" + input.value + "' at [" + input.pos + "]");
          } else if (head === "v") {
            throw new SyntaxError("Expected a symbol but instead saw: '" + input.value + "' at [" + input.pos + "]");
          } else {
            throw new SyntaxError("Expected: '" + head + "' but instead saw: '" + input.value + "' at [" + input.pos + "]");
          }
        }
      }
    }
    return this.AST;
  }
}
