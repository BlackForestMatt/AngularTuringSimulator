var fs = require("fs");
var code = fs.readFileSync("dist/turing.js", "utf8");
eval(code);

describe("Simulator", function () {
  var compiler;
  var code;
  var simulator;

  beforeEach(function () {
    compiler = new Compiler();
    code = compiler.compile("start := z0; blank := _; end := {z1}; z0, a -> z1, a, -;");
    simulator = new TuringSimulator(code);
  });

  it("should initialize", function () {
    expect(simulator).toBeDefined();
  });
});
