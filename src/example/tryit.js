(function (){
  // Initialize Turing compiler
  var compiler = new Compiler(),
      code,
      simulator;

  var btn_compile = document.getElementById('btn_compile'),
      src_code = document.getElementById('src_code'),
      btn_run = document.getElementById('btn_run'),
      input = document.getElementById('input'),
      output = document.getElementById('output');

  function out(text) {
    output.innerHTML += text + '<br>';
    output.scrollTop = output.scrollHeight;
  }

  function compile() {
    try {
      out('compiling src...');
      code = compiler.compile(src_code.value);
      simulator = new TuringSimulator(code);
      simulator.setStateMap(compiler.getStateMap());
      out('compile OK!');
    } catch (e) {
      out(e);
    }
  }

  btn_compile.addEventListener('click', compile);

  btn_run.addEventListener('click', function () {
    if (!simulator) {
      compile();
    }
    var transitions = '';
    simulator.setup(input.value);
    var conf = simulator.step();
    transitions += conf.tape + " " + conf.state + '<br>';
    while (!conf.isDone) {
      conf = simulator.step();
      transitions +=  conf.tape + " " + conf.state + '<br>';
    }
    out(transitions);
    if (!conf.isEndState) {
      out('aborted in non endstate');
    } else {
      out('accepted');
    }
  });
})();
