/**
 * Created by josef on 12/10/16.
 */

export class TConfiguration {

  private _state: string;
  private _position: number;
  private _tape: string;
  private _isEndState: boolean;
  private _isDone: boolean;

  constructor(state: string, position: number, tape: string, endState: boolean,  done: boolean) {
    this._state = state;
    this._position = position;
    this._tape = tape;
    this._isEndState = endState;
    this._isDone = done;
  }


  get state(): string {
    return this._state;
  }

  get position(): number {
    return this._position;
  }

  get tape(): string {
    return this._tape;
  }

  get isEndState(): boolean {
    return this._isEndState;
  }

  get isDone(): boolean {
    return this._isDone;
  }
}
