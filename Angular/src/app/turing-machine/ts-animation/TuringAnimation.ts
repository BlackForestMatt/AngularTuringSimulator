


import {TuringmachineService} from "../../turingmachineservice.service";
import {TuringData} from "../../TuringData";
import {TuringCommand} from "../../TuringCommand";
import {transition} from "@angular/core";
export class TuringAnimation {
  private color: string = "#38A214";
  private canvasWidth: number;
  private canvasHeight: number;
  private cellSize: number;       //sq_size
  private nCell: number = 30;
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

  constructor(private tsService: TuringmachineService) {}

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

    this._speedBar.noUiSlider.on('slide',() => {
      this.speed = 2.0001 - (2 * this._speedBar.noUiSlider.get())/100;
      console.log("Speed: "+this.speed);

    });

  }

  animate(direction: number,turingCommand: TuringCommand,writeChar: string) {
    if (direction != 0) {

      this.first_X = (this.first_X - direction + this.nCell) % this.nCell;
      this.currentX = this.currentX + direction * this.cellSize;

      let to_move = (this.first_X - 1 + this.nCell) % this.nCell;
      console.log("Animate");
      let target_position = this.currentX + (this.nCell - 2) * this.cellSize;
      let square_to_move = this.rectGroup.getChildren()[to_move];

      let rectTween = new (Kinetic as any).Tween({
        node: this.rectGroup,
        x: this.currentX,
        duration: this.speed,
        easing: (Kinetic as any).Easings.EaseInOut,
        onFinish: () => {
          //this.write(turingCommand,writeChar);
          //this.nextStep();

          switch(direction) {
            case -1:
              this.middleTape++;
              break;
            case 1:
              this.middleTape--;
              break;
          }
        }
      });

      let symbolTween = new (Kinetic as any).Tween({
        node: this.symbolGroup,
        x: this.currentX,
        duration: this.speed,
        easing: (Kinetic as any).Easings.EaseInOut,
        onFinish: () => {
          this.write(turingCommand,writeChar);
          if (!this._isPause) {
          this.nextStep();
        }
        }
      });

      rectTween.play();
      symbolTween.play();
    }
  }


  public loadInput(input: string) {
    this.inputText = input;
    let group = this.symbolGroup.getChildren();

    for (let i = 0; i < input.length; i++) {
      let char = input.charAt(i);
      group[this.middleTape+i].setText(char);
    }
    this.layer.draw();
  }

  public start() {
    this.nextStep();
  }

  public nextStep() {
    let turingData;
      if(!this.isStarted && this.inputText !== '') {
        turingData = this.tsService.start(this.inputText);
        this.isStarted = true;
      } else {
        turingData = this.tsService.step();
      }

      if(!turingData.isDone) {
        let direction = turingData.direction;

        let writeChar = turingData.writeChar;
        let turingCommand = turingData.turingCommand;

        this.transitionData = this.transitionData + turingData.transition;
        this._transitionEditor.setValue(this.transitionData);

        this.animate(direction,turingCommand,writeChar);
      } else {

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


  // (speed_bar as any).noUiSlider.on('slide', () => {
  //   this.trans_speed = 2.0001 - (2 * (speed_bar as any).noUiSlider.get())/100;
  // });

  public changeSpeed() {
    //TuringAnimation.speed = 2.0001 - (2 * this._speedBar.noUiSlider.get())/100;
    //console.log(TuringAnimation.speed);
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
}
