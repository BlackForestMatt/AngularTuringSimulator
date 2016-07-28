var fs = require('fs');
var code = fs.readFileSync(__dirname + '/../../../dist/simulator.js','utf-8');
eval(code);

describe("Lexer", function () {
  var lex;
  var tokens;
  var src;
  var alph = [
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

  beforeEach(function () {
    lex = new Lexer(alph);
    tokens = [];
    src = "";
  });

  it("should initialize", function () {
    expect(lex).toBeDefined();
  });

  it("should filter comments", function () {
    src = "/this is a comment";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "$"})
    ]);

    src = "/this is a comment with newline\n";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "$"})
    ]);

    src = "/this is a\n /multiline \n /comment";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "$"})
    ]);

    src = "/this is a comment \n this is not";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "this"}),
      jasmine.objectContaining({value: "is"}),
      jasmine.objectContaining({value: "not"}),
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should tokenize terminals", function () {
    src = "start";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "start"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "blank";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "blank"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "end";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "end"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = ":=";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "->";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "->"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = ",";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: ","}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = ";";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "{";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "{"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "}";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "}"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "<";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "<"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = ">";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: ">"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "-";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "-"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "startblankend:={},;<>-->";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "start"}),
      jasmine.objectContaining({type: "TERMINAL", value: "blank"}),
      jasmine.objectContaining({type: "TERMINAL", value: "end"}),
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({type: "TERMINAL", value: "{"}),
      jasmine.objectContaining({type: "TERMINAL", value: "}"}),
      jasmine.objectContaining({type: "TERMINAL", value: ","}),
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({type: "TERMINAL", value: "<"}),
      jasmine.objectContaining({type: "TERMINAL", value: ">"}),
      jasmine.objectContaining({type: "TERMINAL", value: "-"}),
      jasmine.objectContaining({type: "TERMINAL", value: "->"}),
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should skip whitespaces", function () {
    src = " start";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "start"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "start ";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "start"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "\tstart";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "start"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = " start \n end ";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({value: "start"}),
      jasmine.objectContaining({value: "end"}),
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should tokenize identifiers", function () {
    src = "a";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "IDENTIFIER", value: "a"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "anIdentifier";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "IDENTIFIER", value: "anIdentifier"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "two identifiers";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "IDENTIFIER", value: "two"}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "identifiers"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "or three identifiers";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "IDENTIFIER", value: "or"}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "three"}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "identifiers"}),
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should tokenize multiple statements", function () {
    src = "start := z0;";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "start"}),
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "z0"}),
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "start:=z0;";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "start"}),
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "z0"}),
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = " start:=z0 ;";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "start"}),
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "z0"}),
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({value: "$"})
    ]);

    src = "end := {z0};";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      jasmine.objectContaining({type: "TERMINAL", value: "end"}),
      jasmine.objectContaining({type: "TERMINAL", value: ":="}),
      jasmine.objectContaining({type: "TERMINAL", value: "{"}),
      jasmine.objectContaining({type: "IDENTIFIER", value: "z0"}),
      jasmine.objectContaining({type: "TERMINAL", value: "}"}),
      jasmine.objectContaining({type: "TERMINAL", value: ";"}),
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should give a tokens position", function () {
    src = "start := z0;";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      {type: "TERMINAL", value: "start", pos: 0},
      {type: "TERMINAL", value: ":=", pos: 6},
      {type: "IDENTIFIER", value: "z0", pos: 9},
      {type: "TERMINAL", value: ";", pos: 11},
      jasmine.objectContaining({value: "$"})
    ]);

    src = "z0, a -> z0, b, >;";
    tokens = lex.tokenize(src);
    expect(tokens).toEqual([
      {type: "IDENTIFIER", value: "z0", pos: 0},
      {type: "TERMINAL", value: ",", pos: 2},
      {type: "IDENTIFIER", value: "a", pos: 4},
      {type: "TERMINAL", value: "->", pos: 6},
      {type: "IDENTIFIER", value: "z0", pos: 9},
      {type: "TERMINAL", value: ",", pos: 11},
      {type: "IDENTIFIER", value: "b", pos: 13},
      {type: "TERMINAL", value: ",", pos: 14},
      {type: "TERMINAL", value: ">", pos: 16},
      {type: "TERMINAL", value: ";", pos: 17},
      jasmine.objectContaining({value: "$"})
    ]);
  });

  it("should error on onknown input", function () {
    var run = function () {
      tokens = lex.tokenize(src);
    };

    src = "+";
    expect(run).toThrowError("Unexpected character: +");

    src = "start+";
    expect(run).toThrowError("Unexpected character: +");

    src = "*";
    expect(run).toThrowError("Unexpected character: *");

    src = "#";
    expect(run).toThrowError("Unexpected character: #");
  });
});
