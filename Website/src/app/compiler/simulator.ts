/**
 * Created by josef on 1/18/17.
 */
/**
 * Represents a turing machine configuration
 */
export class TuringConfiguration {
  state: string;
  position: number;
  tape: string;
  isEndState: boolean;
  isDone: boolean;

  constructor(state: string, position: number, tape: string, endState: boolean,  done: boolean) {
    this.state = state;
    this.position = position;
    this.tape = tape;
    this.isEndState = endState;
    this.isDone = done;
  }
}

/**
 * Simulator to run turing machine definitions on an input string
 */
export class TuringSimulator {
  private code: number[][];
  private tape: number[];
  private tapePos: number;
  private state: number;
  private blank: number;
  private steps: number;
  private stateMap;

  constructor(code) {
    this.code = code;
    this.tapePos = 1;
    this.state = this.code[0][0];
    this.blank = this.code[1][0];
    this.steps = 0;
  }

  /**
   * Initialize tape with the given word
   * @param word Initial tape contents
   */
  private setWord(word: string): void {
    this.tape = [this.blank];
    for (let i = 0; i < word.length; i++) {
      // Get charachter shift value from code array
      let char: number = word.charCodeAt(i);
      let map: number = this.code[3].indexOf(char);
      this.tape.push(map);
    }
    this.tape.push(this.blank);
  }

  /**
   * Resets the simulator
   */
  private reset() {
    this.tapePos = 1;
    this.state = this.code[0][0];
    this.steps = 0;
  }

  /**
   * Gets word on tape
   * @return tape contents
   */
  private getWord(): string {
    let word: string = "";
    for (let i = 0; i < this.tape.length; i++) {
      let code: number = this.tape[i];
      word += String.fromCharCode(this.code[3][code]);
    }
    return word;
  }

  /**
   * Get the state name of a numerical representativ
   * if mapping isn't set it just returns the number
   * @param rep the state
   * @return state name
   */
  private getState(rep: number): string {
    let state: string = "" + rep;
    if (this.stateMap) {
      for (let item in this.stateMap) {
        if (this.stateMap[item] === rep) {
          state = item;
        }
      }
    }
    return state;
  }

  private updateTape() {
    // If head position reaches bounds, resize tape
    if (this.tapePos >= this.tape.length) {
      this.tape.push(this.blank);
    } else if (this.tapePos < 0) {
      this.tape.unshift(this.blank);
      this.tapePos++;
    }
  }

  /**
   * Checks if a state is an endstate
   * @param state State to check
   */
  isEndState(state: number): boolean {
    return this.code[2][state] === 1;
  }

  /**
   * Set the state map for more detailed output
   * @param stateMap the State map
   */
  setStateMap(stateMap): void {
    this.stateMap = stateMap;
  }

  /**
   * Resets the Simulator and sets the tape to given word
   * @param word Initial tape contents
   */
  setup(word: string): void {
    this.reset();
    this.setWord(word);
  }

  getSteps(): number {
    return this.steps;
  }

  /**
   * Does one execution step and returns the curent configuration
   * @return configuration
   */
  step(): TuringConfiguration {
    let config: TuringConfiguration;
    if (this.tape) {
      let s: number = this.state;
      let p: number = this.tapePos;
      let c: number = this.tape[p];
      let running: boolean = this.code[s] && this.code[s][c] && this.code[2][s] === 0;
      if (running) {
        this.steps++;
        this.state = this.code[s][c];
        this.tape[p] = this.code[s][c + 1];
        this.tapePos += this.code[s][c + 2];
        this.updateTape();
      }
      config = new TuringConfiguration(
        this.getState(s),
        p,
        this.getWord(),
        this.isEndState(s),
        !running
      );
    } else {
      throw new Error("No input to run simulator on");
    }
    return config;
  }

  /**
   * Runs Simulator on given input
   * @param word input to run on
   * @return word result
   */
  run(word: string): TuringConfiguration {
    this.setup(word);
    let config: TuringConfiguration = this.step();
    while (!config.isDone) {
      config = this.step();
    }
    return config;
  }

  getBlankSymbol(): string {
    return String.fromCharCode(this.code[3][this.blank]);
  }
}
