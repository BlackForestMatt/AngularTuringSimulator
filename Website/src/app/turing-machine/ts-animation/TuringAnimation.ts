import {TuringmachineService} from "../../turingmachineservice.service";
import {TuringData} from "../../TuringData";
import {TuringCommand} from "../../TuringCommand";
import {transition, NgZone} from "@angular/core";
import {TsAnimationComponent} from "./ts-animation.component";
export class TuringAnimation {
  private color: string = "#38A214";
  private canvasWidth: number;
  private canvasHeight: number;
  private cellSize: number;       //sq_size
  private nCell: number = 100;
  private middleTape: number;
  private rectGroup;
  private symbolGroup;
  private layer;
  private currentX: number = 0;
  private first_X: number = 0;
  private isStarted = false;
  private inputText;
  private _isPause = false;
  private _transitionEditor;
  private _speedBar;
  private transitionData = "";
  private speed: number;
  private isAnimationDone = false;
  private stateDiagram: Map<string,number>;

  constructor(private tsService: TuringmachineService,private tsComponent: TsAnimationComponent,private zone: NgZone) {}

  init() {
    this.canvasWidth = document.getElementById("canvasWidth").offsetWidth;
    this.canvasWidth -=  this.canvasWidth * 0.006024;

    this.cellSize = this.canvasWidth / (25 - 2);
    this.canvasHeight = this.cellSize * 2;

    this.layer = new Kinetic.Layer();
    this.rectGroup = new Kinetic.Group({});
    this.symbolGroup = new Kinetic.Group({});

    let stage = new Kinetic.Stage({ //height => 0 wird nicht angezeigt!!!
      container: 'canvasWidth',
      width: this.canvasWidth,
      height: this.canvasHeight
    });

    let x = 0;
    let y = (this.canvasHeight - this.cellSize) / 2; //Mitte
    let middle = this.canvasWidth / 2;

    for( let i = 0; i <= this.nCell; i++) {

      x = this.cellSize * (i-1);

      let rectangle = new Kinetic.Rect({
        x: x,
        y: y,
        width: this.cellSize,
        height: this.cellSize,
        fill: this.color,
        stroke: 'white',
        strokeWidth: 2,
        cornerRadius: 2
      });

      if(((x + this.cellSize) >= middle) && (x <= middle)) {
        this.middleTape = i;
      }

      let symbol = new Kinetic.Text({
        x: this.cellSize * (i-1),
        y: y + (this.cellSize/6),
        fill: "white",
        text: " ",
        fontSize: (2 * this.cellSize/3) - (2 * this.cellSize/3) * 0.02,
        fontFamily: 'Helvetica',
        height: this.cellSize,
        width: this.cellSize,
        align: 'center',
      });

      x = x + this.cellSize + 20;

      this.rectGroup.add(rectangle);
      this.symbolGroup.add(symbol);
    }

    y = ((0.1) + (4/3)) * this.cellSize - this.cellSize/6;

    let poly = new Kinetic.RegularPolygon({
      x: (this.canvasWidth/2),
      y: (y + 2 * this.cellSize/5),
      sides: 3,
      radius: (this.cellSize/3),
      fill: '#000',
      stroke: '#000',
      strokeWidth: (4*2/3)
    });
    this.layer.add(this.rectGroup);
    this.layer.add(this.symbolGroup);
    this.layer.add(poly);
    stage.add(this.layer);

    this.speed = 2.0001 - (1.3 * this._speedBar.noUiSlider.get())/100;
    this._speedBar.noUiSlider.on('slide',() => {
      this.speed = 2.0001 - (1.7 * this._speedBar.noUiSlider.get())/100;
      console.log("Speed: "+this.speed);
    });
  }

  animate(direction: number,turingCommand: TuringCommand,writeChar: string,doneCallback: () => void) {
    if (direction != 0) {

      this.first_X = (this.first_X - direction + this.nCell) % this.nCell;
      this.currentX = this.currentX + direction * this.cellSize;

      console.log("Animate");

      let rectTween = new (Kinetic as any).Tween({
        node: this.rectGroup,
        x: this.currentX,
        duration: this.speed,
        easing: (Kinetic as any).Easings.EaseInOut,
        onFinish: () => {

        }
      });

      let symbolTween = new (Kinetic as any).Tween({
        node: this.symbolGroup,
        x: this.currentX,
        duration: this.speed,
        easing: (Kinetic as any).Easings.EaseInOut,
        onFinish: () => {

          switch(direction) {
            case -1:
              this.middleTape++;
              break;
            case 1:
              this.middleTape--;
              break;
          }

          this.write(turingCommand,writeChar);
          if (!this._isPause) {
            this.nextStep();
          }

          doneCallback();
        }
      });

      rectTween.play();
      symbolTween.play();
    }
  }


  public loadInput(input: string) {
    this.clear();
    this.inputText = input;
    let group = this.symbolGroup.getChildren();

    for (let i = 0; i < input.length; i++) {
      let char = input.charAt(i);
      group[this.middleTape+i].setText(char);
    }
    this.layer.draw();
  }

  public start() {
    this._isPause = false;
    this.nextStep();
  }

  public nextStep() {
    let turingData;
    if(!this.isStarted && this.inputText !== '') {

      this.stateDiagram = this.tsService.getStateDiagram();
      turingData = this.tsService.start(this.inputText);
      this.tsComponent.counter = turingData.counter;
      this.tsComponent.state = turingData.currentState;
      this.isStarted = true;

      if(turingData.isFirstTapeChange) {
          this.write(turingData.firstCommand,turingData.firstWriteChar);
      }

    } else {
      turingData = this.tsService.step();
    }

    if(!turingData.isDone || !this.isAnimationDone) {
      let direction = turingData.direction;
      let writeChar = turingData.writeChar;
      let turingCommand = turingData.turingCommand;

      this.transitionData = this.transitionData + turingData.transition;
      if(turingData.isDone) {
        this.isAnimationDone = false;
      }

      if(this.transitionData !== "") {
        this._transitionEditor.setValue(this.transitionData);
        let lastLine = this._transitionEditor.lastLine()-1;
        this._transitionEditor.setCursor({line: lastLine, ch: 0})
      }

      this.zone.runOutsideAngular( () =>  {
        this.animate(direction,turingCommand,writeChar,() => {
          this.zone.run(() => {
            this.tsComponent.counter = turingData.counter;
            this.updateDiagram(turingData.currentState);

            if(turingData.isDone) {
              this.tsComponent.state = turingData.newState;
              this.updateDiagram(turingData.newState);

              this.tsComponent.resetInputBtnVisible();
              this.tsComponent.sendStateDiagram(this.stateDiagram);
              if (turingData.isEndState) {
                this.tsComponent.isSuccess = true;
              } else {
                this.tsComponent.isFail = true;
              }

            } else {
              this.tsComponent.state = turingData.currentState;
            }
            });
        })
      })

      }

  }


  private write(turingCommand: TuringCommand,writeChar: string) {
    let group = this.symbolGroup.getChildren();

    switch(turingCommand) {
      case TuringCommand.Write:
        group[this.middleTape].setText(writeChar);
        break;
      case TuringCommand.Nothing:
        break;
    }
  }

  set isPause(value) {
    this._isPause = value;
  }

  set transitionEditor(value) {
    this._transitionEditor = value;
  }

  set speedBar(value) {
    this._speedBar = value;
  }


  public clear() {
    this.isStarted = false;
    this._isPause = false;
    this.inputText = "";
    this.isAnimationDone = false;

    this.resetInputSymbols();
  }

  public resetInputSymbols() {
    let group = this.symbolGroup.getChildren();
    let min = this.middleTape - 12;
    let max = this.middleTape + 12;

    for(let i = min; i < max ;i++) {
      group[i].setText(" ");
    }
    this.layer.draw();
  }

  private updateDiagram(state:string) {
     if(this.stateDiagram.has(state)) {
        let counter = this.stateDiagram.get(state);
        counter++;
        this.stateDiagram.delete(state);
        this.stateDiagram.set(state,counter);
     }
  }
}
