/**
 * Created by josef on 12/12/16.
 */

export class TuringDiagram {
  private _stateDiagram = new Map<string,number>();


  get stateDiagram(): Map<string, number> {
    return this._stateDiagram;
  }

  set stateDiagram(value: Map<string, number>) {
    this._stateDiagram = value;
  }
}
