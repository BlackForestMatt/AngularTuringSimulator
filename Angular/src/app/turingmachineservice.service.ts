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
      let oldConf = this.simulator.step();
      let newConf = this.simulator.step();

      this.lastConf = newConf;
      let direction = this.getDirection(oldConf.position,newConf.position);
      let command = this.getTuringCommand(oldConf.tape,newConf.tape,oldConf.position,newConf.position);

      if(command === TuringCommand.Nothing ) {
        this.writeChar = "";
      }

      let transition = this.getTransition(oldConf.state,direction,newConf.state);

      this.lastTuringData = new TuringData(newConf.state,newConf.tape,newConf.position,newConf.isEndState,newConf.isDone,direction,this.writeChar,command,this.counter,transition);
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
      return 1;
    } else if(oldPos > newPos) {
      return -1;
    } else {
      return 0;
    }
  }

  private getTuringCommand(currentTape: string,newTape: string, currentPos: number,newPos: number):TuringCommand{
    if(currentPos < currentTape.length) {
      this.currentChar = currentTape.charAt(currentPos);
    } else {
      this.currentChar = '';
    }

    if(newPos < newTape.length) {
      this.newChar = newTape.charAt(newPos);
    } else {
      this.newChar = '';
    }

    if(this.currentChar === this.newChar) {
      return TuringCommand.Nothing;
    } else {
      this.writeChar = this.newChar;
      return TuringCommand.Write;
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
    return "("+currentState+","+this.currentChar +")" + " := " + "("+ newState + "," + this.newChar + "," + directionLRN + ")";
  }


  get isCompile(): boolean {
    return this._isCompile;
  }
}
