var fs = require('fs');
var code = fs.readFileSync(__dirname + '/../../../dist/simulator.js','utf-8');
eval(code);

describe('Parser', function () {
  var parser;
  var tokens;
  var AST;

  beforeEach(function () {
    parser = new Parser();
  });

  it("should initialize", function () {
    expect(parser).toBeDefined();
  });

  describe("Valid input recognition", function () {
    it("should parse start Assignments", function () {
      tokens = [
        {type: "TERMINAL", value: "start", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "ASSIGNMENT",
          children: [
            jasmine.objectContaining({data: "start"}),
            jasmine.objectContaining({data: "z0"})
          ]
        })
      ]);
    });

    it("should parse blank Assignments", function () {
      tokens = [
        {type: "TERMINAL", value: "blank", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "_", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "ASSIGNMENT",
          children: [
            jasmine.objectContaining({data: "blank"}),
            jasmine.objectContaining({data: "_"})
          ]
        })
      ]);
    });

    it("should parse end Assignments", function () {
      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "ASSIGNMENT",
          children: [
            jasmine.objectContaining({data: "end"}),
            jasmine.objectContaining({data: "z0"})
          ]
        })
      ]);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "ASSIGNMENT",
          children: [
            jasmine.objectContaining({data: "end"}),
            jasmine.objectContaining({data: "z0"}),
            jasmine.objectContaining({data: "z1"})
          ]
        })
      ]);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "z2", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "ASSIGNMENT",
          children: [
            jasmine.objectContaining({data: "end"}),
            jasmine.objectContaining({data: "z0"}),
            jasmine.objectContaining({data: "z1"}),
            jasmine.objectContaining({data: "z2"})
          ]
        })
      ]);
    });

    it("Should parse functions", function () {
      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "FUNCTION",
          children: [
            jasmine.objectContaining({data: "z0"}),
            jasmine.objectContaining({data: "a"}),
            jasmine.objectContaining({data: "z1"}),
            jasmine.objectContaining({data: "b"}),
            jasmine.objectContaining({data: ">"})
          ]
        })
      ]);

      tokens = [
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: "<", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "FUNCTION",
          children: [
            jasmine.objectContaining({data: "z1"}),
            jasmine.objectContaining({data: "a"}),
            jasmine.objectContaining({data: "z0"}),
            jasmine.objectContaining({data: "b"}),
            jasmine.objectContaining({data: "<"})
          ]
        })
      ]);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: "-", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      AST = parser.parse(tokens);
      expect(AST).toBeDefined();
      expect(AST.children).toEqual([
        jasmine.objectContaining({
          data: "FUNCTION",
          children: [
            jasmine.objectContaining({data: "z0"}),
            jasmine.objectContaining({data: "b"}),
            jasmine.objectContaining({data: "z1"}),
            jasmine.objectContaining({data: "a"}),
            jasmine.objectContaining({data: "-"})
          ]
        })
      ]);
    });
  });
  describe("Invalid input recognition", function () {
    it("should throw SyntaxError on missing start arguments", function () {
      tokens = [
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "start", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /:=/);

      tokens = [
        {type: "TERMINAL", value: "start", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /state/);

      tokens = [
        {type: "TERMINAL", value: "start", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /;/);
    });

    it("should throw SyntaxError on missing blank arguments", function () {
      tokens = [
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "_", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "blank", pos: 0},
        {type: "IDENTIFIER", value: "_", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /:=/);

      tokens = [
        {type: "TERMINAL", value: "blank", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /symbol/);

      tokens = [
        {type: "TERMINAL", value: "blank", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "_", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /;/);
    });

    it("should throw SyntaxError on missing end arguments", function () {
      tokens = [
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /:=/);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /\{/);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /state/);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /state/);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: ":=", pos: 0},
        {type: "TERMINAL", value: "{", pos: 0},
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: "}", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /;/);
    });

    it("should throw SyntaxError on missing function arguments", function () {
      tokens = [
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /,/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /symbol/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /->/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /state/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /,/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /symbol/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /,/);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ";", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "IDENTIFIER", value: "z0", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "a", pos: 0},
        {type: "TERMINAL", value: "->", pos: 0},
        {type: "IDENTIFIER", value: "z1", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "IDENTIFIER", value: "b", pos: 0},
        {type: "TERMINAL", value: ",", pos: 0},
        {type: "TERMINAL", value: ">", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0}
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError, /;/);
    });

    it("should throw SyntaxError on unknow symbols", function () {
      tokens = [
        {type: "TERMINAL", value: "+", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0},
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "*", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0},
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "start", pos: 0},
        {type: "TERMINAL", value: "+", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0},
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "blank", pos: 0},
        {type: "TERMINAL", value: "+", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0},
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);

      tokens = [
        {type: "TERMINAL", value: "end", pos: 0},
        {type: "TERMINAL", value: "+", pos: 0},
        {type: "ENDOFINPUT", value: "$", pos: 0},
      ];

      expect(function () {
        parser.parse(tokens);
      }).toThrowError(SyntaxError);
    });
  });
});
