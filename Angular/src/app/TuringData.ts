import {TuringCommand} from "./TuringCommand";
/**
 * Created by josef on 11/27/16.
 */


export class TuringData {

  private _state:string;
  private _tape:string;
  private _position:number;
  private _endState: boolean;
  private _done: boolean;
  private _direction: number; //1 or -1
  private _writeChar: string;
  private _turingCommand: TuringCommand;
  private _counter: number;
  private _transition: string;
  private

  constructor(state: string, tape: string, position: number, endState: boolean, done: boolean, direction: number, writeChar: string, turingCommand: TuringCommand, counter: number, transition: string) {
    this._state = state;
    this._tape = tape;
    this._position = position;
    this._endState = endState;
    this._done = done;
    this._direction = direction;
    this._writeChar = writeChar;
    this._turingCommand = turingCommand;
    this._counter = counter;
    this._transition = transition;
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

  get state(): string {
    return this._state;
  }

  set state(value: string) {
    this._state = value;
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

  get endState(): boolean {
    return this._endState;
  }

  set endState(value: boolean) {
    this._endState = value;
  }

  get done(): boolean {
    return this._done;
  }

  set done(value: boolean) {
    this._done = value;
  }

}
