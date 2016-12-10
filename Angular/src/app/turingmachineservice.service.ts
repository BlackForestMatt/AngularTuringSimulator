import { Injectable } from '@angular/core';
import {TuringData} from "./TuringData";
import {TuringCommand} from "./TuringCommand";
import {TransitionData} from "./TransitionData";
import {TConfiguration} from "./TConfiguration";

declare var Compiler: any;
declare var TuringSimulator: any;

@Injectable()
export class TuringmachineService {

  private compiler;
  private code;
  private simulator;
  private _isCompile = false;
  private lastTuringData: TuringData;
  private isStart: boolean;
  private isDone: boolean;
  private counter: number;

  private writeChar: string = '';
  private currentChar: string;
  private newChar: string;
  private secondTuringConf:TConfiguration;
  private thirdTuringConf:TConfiguration;

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
    this.counter = 1;

    if(this._isCompile) {
      this.simulator.setup(input);

      let firstConf = this.simulator.step();
      let secondConf = this.simulator.step();
      let thirdConf = this.simulator.step();

      this.secondTuringConf = new TConfiguration(secondConf.state,secondConf.position,secondConf.tape,secondConf.isEndState,secondConf.isDone);
      this.thirdTuringConf = new TConfiguration(thirdConf.state,thirdConf.position,thirdConf.tape,thirdConf.isEndState,thirdConf.isDone);

      let direction = this.getDirection(firstConf.position,secondConf.position);
      let command = this.getTuringCommand(firstConf.tape,secondConf.tape,firstConf.position,secondConf.position);

      console.log("Direction: "+direction);
      console.log(secondConf);
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


      if(command === TuringCommand.Nothing ) {
        this.writeChar = "";
      }

      let transition = this.getTransition(firstConf.state,secondConf.state,secondConf.tape,firstConf.tape,secondConf.position,firstConf.position,thirdConf.state,thirdConf.position);
      console.log(transition);

      console.log("________________________________________________________");

      this.lastTuringData = new TuringData(secondConf.state,secondConf.tape,secondConf.position,secondConf.isEndState,secondConf.isDone,direction,this.writeChar,command,this.counter,transition);
      this.counter++;
      return this.lastTuringData;
    } else {
      return null;
}
  }

  public step():TuringData {
    if(this.isStart) {
      //if (!this.secondTConf.isDone) {
        let conf = this.simulator.step();

        let secondConf = this.secondTuringConf;
        let thirdConf = this.thirdTuringConf;

        console.log(this.secondTuringConf);
        console.log(this.thirdTuringConf);

        let direction = this.getDirection(secondConf.position, thirdConf.position);
        let command = this.getTuringCommand(secondConf.tape, thirdConf.tape, secondConf.position, thirdConf.position);

        let transitions = conf.tape + " " + thirdConf.state + " Pos: " + thirdConf.position + '<br>';

        console.log("Direction: " + direction);
        console.log(transitions);

        switch (command) {
          case TuringCommand.Nothing:
            console.log("Nothing");
            break;
          case TuringCommand.Write:
            console.log("Write");
            break;
          }


        if (command === TuringCommand.Nothing) {
          this.writeChar = "";
        }

        let transition;
        if(!this.thirdTuringConf.isDone) {
          transition = this.getTransition(thirdConf.state, secondConf.state, secondConf.tape, thirdConf.tape, secondConf.position, thirdConf.position, conf.state, conf.position);
        } else {
          transition = "";
        }

        console.log(transition);
        console.log("________________________________________________________");
        this.lastTuringData = new TuringData(conf.state, thirdConf.tape, thirdConf.position, thirdConf.isEndState, thirdConf.isDone, direction, this.writeChar, command, this.counter, transition);
        this.counter++;
        this.secondTuringConf = this.thirdTuringConf;
        this.thirdTuringConf = new TConfiguration(conf.state,conf.position,conf.tape,conf.isEndState,conf.isDone);
        return this.lastTuringData;
      //}
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

  private getTransition(currentState:string,lastState:string,lastTape:string,currentTape:string,lastPos: number,currentPos:number,nextState:string,nextPos:number):string {
    let directionLRN = "undefined!";

    let direction = this.getDirection(currentPos, nextPos);
    directionLRN = this.getDirectionLRN(direction);


    currentPos--;
    lastPos--;
    nextPos--;

    let currentChar;
    let newChar;
    if(currentPos >= 0) {

      if(this.counter == 1) {
        newChar = currentTape.charAt(currentPos);
        currentChar = lastTape.charAt(currentPos);
        direction = this.getDirection(currentPos, lastPos);
        directionLRN = this.getDirectionLRN(direction);

        let newChar2 = currentTape.charAt(lastPos);
        let currentChar2 = lastTape.charAt(lastPos);
        let direction2 = this.getDirection(lastPos, nextPos);
        let directionLRN2 = this.getDirectionLRN(direction2);

        return "("+currentState+","+currentChar +")" + " := " + "("+ lastState + "," + newChar + "," + directionLRN + ") \n ("+lastState+","+currentChar2 +")" + " := " + "("+ nextState + "," + newChar2 + "," + directionLRN2 + ") \n";
      } else {

        newChar = currentTape.charAt(currentPos);
        currentChar = lastTape.charAt(currentPos);
      }
    } else {
      currentChar = "";
      newChar = "";
    }


    return "("+currentState+","+currentChar +")" + " := " + "("+ nextState + "," + newChar + "," + directionLRN + ") \n";
  }

  private getDirectionLRN(direction: number):string {
    switch (direction) {
      case 0:
        return "N";
      case 1:
        return "L";
      case -1:
        return "R";

    }
  }


  get isCompile(): boolean {
    return this._isCompile;
  }

}
