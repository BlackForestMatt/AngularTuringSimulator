interface token {
  type: string;
  value: string;
  pos: number;
}

class Lexer {
  private terminalAlphabet: string[] = [
    'start',
    'blank',
    'end',
    ':=',
    '->',
    ',',
    ';',
    '{',
    '}',
    '<',
    '>',
    '-',
  ];
  private tokens: token[];
  private source: string;
  private len: number;
  private pos: number;

  constructor() {
    this.tokens = [];
    this.source = '';
    this.len = 0;
    this.pos = 0;
  }

  private inBounds(): boolean {
    return this.pos < this.len;
  }

  private getChar(): string {
    return this.source.charAt(this.pos);
  }

  private isNewline(char: string): boolean {
    return char == '\r' || char == '\n';
  }

  private isSpace(char: string): boolean {
    return char == ' ' || char == '\t';
  }

  private isNumeric(char: string): boolean {
    return (char >= '0' && char <= '9');
  }

  private isAplha(char: string): boolean {
    return (char >= 'a' && char <= 'z') ||
           (char >= 'A' && char <= 'Z');
  }

  private alphabetIndex(): number {
    let alphIndex: number = -1;
    let iPos: number;
    let tPos: number;
    let match: boolean;
    let index: number;
    for (index = 0; index < this.terminalAlphabet.length; index++) {
      let terminal = this.terminalAlphabet[index];
      iPos = this.pos;
      tPos = 0;
      match = true;
      while (match && tPos < terminal.length && iPos < this.source.length) {
        match = match && this.source.charAt(iPos) == terminal.charAt(tPos);
        iPos++;
        tPos++;
      }
      if (match && iPos - this.pos == tPos) {
        return index;
      }
    }
    return alphIndex;
  }

  private skipWhiteSpaces() {
    let char: string = this.getChar();
    while (this.inBounds() && (this.isSpace(char) || this.isNewline(char))) {
      this.pos++;
      char = this.getChar();
    }
  }

  private parseComment() {
    let char: string = this.getChar();
    while (this.inBounds() && !this.isNewline(char)) {
      this.pos++;
      char = this.getChar();
    }
  }

  private parseIdentifier(): token {
    let tok: token;
    let start: number = this.pos;
    let char: string = this.getChar();
    while (this.inBounds() && (this.isAplha(char) || this.isNumeric(char) || char == '_')) {
      this.pos++;
      char = this.getChar();
    }
    tok = {
      type: 'IDENTIFIER',
      value: this.source.substring(start, this.pos),
      pos: start
    }
    return tok;
  }

  tokenize(source: string): token[] {
    this.source = source;
    this.len = source.length;
    this.pos = 0;
    while (this.inBounds()) {
      this.skipWhiteSpaces();
      let tok: token;
      let char: string = this.getChar();
      let alphIndex: number = this.alphabetIndex();
      if (char === '/') {
        this.parseComment();
      } else if (alphIndex != -1) {
        let terminal: string = this.terminalAlphabet[alphIndex];
        tok = {
          type: 'TERMINAL',
          value: this.terminalAlphabet[alphIndex],
          pos: this.pos
        }
        this.pos += terminal.length;
        this.tokens.push(tok);
      } else if ((this.isAplha(char) || this.isNumeric(char) || char == '_')) {
        this.tokens.push(this.parseIdentifier());
      } else {
        throw new Error('Unexpected character: ' + char);
      }
    }
    return this.tokens;
  }
}
