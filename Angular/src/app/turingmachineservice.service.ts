import { Injectable } from '@angular/core';
import {TuringData} from "./TuringData";
import {TuringCommand} from "./TuringCommand";

declare var Compiler: any;
declare var TuringSimulator: any;

@Injectable()
export class TuringmachineService {

  private compiler;
  private code;
  private simulator;
  private _isCompile = false;
  private lastTuringData: TuringData;
  private lastConf;
  private isStart: boolean;
  private isDone: boolean;
  private counter: number;

  private writeChar: string = '';
  private currentChar: string;
  private newChar: string;

  public compile(sourcecode: string) {
    try {
      this.compiler = new Compiler();
      this.code = this.compiler.compile(sourcecode);
      this.simulator = new TuringSimulator(this.code);
      this.simulator.setStateMap(this.compiler.getStateMap());
      this._isCompile = true;
    } catch(e) {
    }
  }

  constructor() {
  }

  // public start2() {
  //   let transitions = '';
  //   this.simulator.setup('abba');
  //   var conf = this.simulator.step();
  //   transitions += conf.tape + " " + conf.state + " Pos: " + conf.position + '\n';
  //   while (!conf.isDone) {
  //     conf = this.simulator.step();
  //     transitions +=  conf.tape + " " + conf.state + " Pos: " + conf.position + '\n';
  //   }
  //   transitions += 'output: ' + conf.tape;
  //   console.log(transitions);
  //   if (!conf.isEndState) {
  //     console.log('not accepted');
  //   } else {
  //     console.log('accepted');
  //   }
  // }

  public start(input: string):TuringData {
    this.isStart = true;
    this.isDone = false;
    this.counter = 0;

    if(this._isCompile) {
      this.simulator.setup(input);

      let firstConf = this.simulator.step();
      let secondConf = this.simulator.step();

      this.lastConf = secondConf;
      let direction = this.getDirection(firstConf.position,secondConf.position);
      let command = this.getTuringCommand(firstConf.tape,secondConf.tape,firstConf.position,secondConf.position);

      console.log("Direction: "+direction);
      //let transitions1 =  input + " " + "s0" + " Pos: " + "0" + '<br>';
      //let transitions2 =  conf.tape + " " + conf.state + " Pos: " + conf.position + '<br>';

      //console.log(transitions1);
      //console.log(transitions2);

      switch(command) {
        case TuringCommand.Nothing:
          console.log("Nothing");
          break;
        case TuringCommand.Write:
          console.log("Write");
          break;
      }
      console.log("________________________________________________________");

      if(command === TuringCommand.Nothing ) {
        this.writeChar = "";
      }

      let transition = this.getTransition(firstConf.state,direction,secondConf.state);

      this.lastTuringData = new TuringData(secondConf.state,secondConf.tape,secondConf.position,secondConf.isEndState,secondConf.isDone,direction,this.writeChar,command,this.counter,transition);
      this.counter++;
      return this.lastTuringData;
    } else {
      return null;
}
  }

  public step():TuringData {
    if(this.isStart) {
      if (!this.lastConf.isDone) {
        let conf = this.simulator.step();

        let direction = this.getDirection(this.lastTuringData.position,conf.position);
        let command = this.getTuringCommand(this.lastTuringData.tape,conf.tape,this.lastTuringData.position,conf.position);

        let transitions =  conf.tape + " " + conf.state + " Pos: " + conf.position + '<br>';

        console.log("Direction: "+direction);
        console.log(transitions);

        switch(command) {
          case TuringCommand.Nothing:
            console.log("Nothing");
            break;
          case TuringCommand.Write:
            console.log("Write");
            break;
        }

        console.log("________________________________________________________");

        if(command === TuringCommand.Nothing ) {
          this.writeChar = "";
        }

        let transition = this.getTransition(this.lastTuringData.state,direction,conf.state);

        this.lastTuringData = new TuringData(conf.state,conf.tape,conf.position,conf.isEndState,conf.isDone,direction,this.writeChar,command,this.counter,transition);
        this.counter++;
        return this.lastTuringData;
      }
    }
    return null;
  }

  private getDirection(oldPos: number,newPos: number):number {
    if(newPos > oldPos) {
      return -1;
    } else if(oldPos > newPos) {
      return 1;
    } else {
      return 0;
    }
  }

  private getTuringCommand(currentTape: string,newTape: string, currentPos: number,newPos: number):TuringCommand{
    console.log("CurrentTape: "+currentTape);
    console.log("CurrentTapeLength: "+ currentTape.length);
    console.log("CurrentPos: "+currentPos);
    console.log("NewTape: "+ newTape);
    console.log("NewTapeLength: "+ newTape.length);
    console.log("NewPos: "+ newPos);

    newPos--;
    if(currentTape.length == newTape.length) {
      if ((currentPos < currentTape.length && (currentPos < newTape.length))) {
        this.currentChar = currentTape.charAt(newPos);
        this.newChar = newTape.charAt(newPos);

        console.log("CurrentChar: " + this.currentChar);
        console.log("NewChar: " + this.newChar);
      } else {
        this.currentChar = '';
        this.newChar = '';
      }


      if (this.currentChar === this.newChar) {
        return TuringCommand.Nothing;
      } else {
        this.writeChar = this.newChar;
        return TuringCommand.Write;
      }
    } else {
      if(newTape.length < currentTape.length) {
        this.writeChar = '';
        return TuringCommand.Write;
      } else {
        this.writeChar = newTape.charAt(newPos);
        return TuringCommand.Write;
      }

    }
  }

  private getTransition(currentState:string,direction:number,newState:string):string {
    let directionLRN = "undefined!";
    switch(direction) {
      case 0:
        directionLRN = "N"
        break;
      case 1:
        directionLRN = "R";
      break;
      case -1:
        directionLRN = "L";
        break;

    }
    return "("+currentState+","+this.currentChar +")" + " := " + "("+ newState + "," + this.newChar + "," + directionLRN + ") \n";
  }


  get isCompile(): boolean {
    return this._isCompile;
  }

}
