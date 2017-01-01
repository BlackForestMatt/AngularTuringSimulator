import {TuringCommand} from "./TuringCommand";
/**
 * Created by josef on 11/27/16.
 */


export class TuringData {

  private _newState:string;
  private _tape:string;
  private _position:number;
  private _isEndState: boolean;
  private _isDone: boolean;
  private _direction: number; //1 or -1
  private _writeChar: string;
  private _turingCommand: TuringCommand;
  private _counter: number;
  private _transition: string;
  private _currentState:string;
  private _isFirstTapeChange: boolean;
  private _firstCommand: TuringCommand;
  private _firstWriteChar: string;

  constructor(state: string, tape: string, position: number, isEndState: boolean, isDone: boolean, direction: number, writeChar: string, turingCommand: TuringCommand, counter: number, transition: string, oldstate: string) {
    this._newState = state;
    this._tape = tape;
    this._position = position;
    this._isEndState = isEndState;
    this._isDone = isDone;
    this._direction = direction;
    this._writeChar = writeChar;
    this._turingCommand = turingCommand;
    this._counter = counter;
    this._transition = transition;
    this._currentState = oldstate;
  }

  get transition(): string {
    return this._transition;
  }

  set transition(value: string) {
    this._transition = value;
  }

  get counter(): number {
    return this._counter;
  }

  set counter(value: number) {
    this._counter = value;
  }

  get writeChar(): string {
    return this._writeChar;
  }

  set writeChar(value: string) {
    this._writeChar = value;
  }

  get turingCommand(): TuringCommand {
    return this._turingCommand;
  }

  set turingCommand(value: TuringCommand) {
    this._turingCommand = value;
  }

  get direction(): number {
    return this._direction;
  }

  set direction(value: number) {
    this._direction = value;
  }

  get newState(): string {
    return this._newState;
  }

  set newState(value: string) {
    this._newState = value;
  }

  get tape(): string {
    return this._tape;
  }

  set tape(value: string) {
    this._tape = value;
  }

  get position(): number {
    return this._position;
  }

  set position(value: number) {
    this._position = value;
  }


  get isEndState(): boolean {
    return this._isEndState;
  }

  set isEndState(value: boolean) {
    this._isEndState = value;
  }

  get isDone(): boolean {
    return this._isDone;
  }

  set isDone(value: boolean) {
    this._isDone = value;
  }



  get currentState(): string {
    return this._currentState;
  }

  set currentState(value: string) {
    this._currentState = value;
  }


  get isFirstTapeChange(): boolean {
    return this._isFirstTapeChange;
  }

  set isFirstTapeChange(value: boolean) {
    this._isFirstTapeChange = value;
  }

  get firstCommand(): TuringCommand {
    return this._firstCommand;
  }

  set firstCommand(value: TuringCommand) {
    this._firstCommand = value;
  }

  get firstWriteChar(): string {
    return this._firstWriteChar;
  }

  set firstWriteChar(value: string) {
    this._firstWriteChar = value;
  }
}
