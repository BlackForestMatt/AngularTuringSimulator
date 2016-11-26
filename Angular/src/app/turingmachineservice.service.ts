import { Injectable } from '@angular/core';

declare var Compiler: any;
declare var TuringSimulator: any;

@Injectable()
export class TuringmachineserviceService {

  private compiler;
  private code;
  private simulator;




  public compile(sourceCode: string) {
    this.compiler = new Compiler();
    this.code = this.compiler.compile(sourceCode);
    this.simulator = new TuringSimulator(this.code);
    this.simulator.setStateMap(this.compiler.getStateMap());
// }
  }

  constructor() {
    //this.compile(this.example1);
    console.log("Service success");
  }

  public step() {

  }

  public start() {
    let transitions = '';
    this.simulator.setup('abba');
    var conf = this.simulator.step();
    transitions += conf.tape + " " + conf.state + " Pos: " + conf.position + '\n';
    while (!conf.isDone) {
      conf = this.simulator.step();
      transitions +=  conf.tape + " " + conf.state + " Pos: " + conf.position + '\n';
    }
    transitions += 'output: ' + conf.tape;
    console.log(transitions);
    if (!conf.isEndState) {
      console.log('not accepted');
    } else {
      console.log('accepted');
    }
  }





}
