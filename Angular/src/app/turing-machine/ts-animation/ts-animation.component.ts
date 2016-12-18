import {Component, OnInit, AfterViewInit, Input, NgZone, Output,EventEmitter} from '@angular/core';
import * as CodeMirror from 'codemirror';
import * as noUiSlider from 'nouislider';
import {TuringAnimation} from "./TuringAnimation";
import {TuringData} from "../../TuringData";
import {TuringmachineService} from "../../turingmachineservice.service";
import {TuringDiagram} from "../../TuringDiagram";

@Component({
  selector: 'ts-animation',
  templateUrl: './ts-animation.component.html',
  styleUrls: ['./ts-animation.component.css']
})
export class TsAnimationComponent implements OnInit {

  private turingAnimation: TuringAnimation;
  private input = "";

  @Input()
  private isPlayBtnVisible: true;

  private _counter = 0;
  private _state: String = "";
  /*
  turing machine process is success or not
  */
  private _isSuccess = false;
  private _isFail = false;
  private inputBtnNotVisible = false;

  @Output()
  eventWordStatus = new EventEmitter<string>();

  @Output()
  eventStateDiagram = new EventEmitter<TuringDiagram>();

  constructor(private tsService: TuringmachineService,private zone: NgZone) { }

  ngOnInit() {
    this.turingAnimation = new TuringAnimation(this.tsService,this,this.zone);
    this.init();
    this.turingAnimation.init();
  }

  init() {
    let transitionEditor = (CodeMirror as any).fromTextArea((document as any).getElementById('consoleCM'), {
      mode: "text/html",
      lineNumbers: true,
      readOnly: true
    });

    transitionEditor.setSize(null,100);
    // myCodeMirror.setValue("Test \ntestdfasdf");
    // myCodeMirror.addLineClass(1,'Josef','CodeMirror-activeline-background');

    let speed_bar = document.getElementById('slider');
    (noUiSlider as any).create(speed_bar, {
      start: 50,
      connect: [true, false],
      orientation: "horizontal",
      range: {
        'min': 0,
        'max': 100
      },
    });

    this.turingAnimation.transitionEditor = transitionEditor;
    this.turingAnimation.speedBar = speed_bar;
  }

  public loadInputData(input: string):void {
    this.input = input;
    this.turingAnimation.loadInput(input);
    this.inputBtnNotVisible = true;
  }

  public play() {
      this.turingAnimation.start();
  }

  public pause() {
      this.turingAnimation.isPause = true;
  }

  get counter(): number {
    return this._counter;
  }

  set counter(value: number) {
    this._counter = value;
  }

  get state(): String {
    return this._state;
  }

  set state(value: String) {
    this._state = value;
  }

  test2() {
    this._counter++;
  }


  get isSuccess() {
    return this._isSuccess;
  }

  set isSuccess(value) {
    if(value) {
      this.eventWordStatus.emit("isSuccess");
    }
    this._isSuccess = value;
  }

  get isFail() {
    return this._isFail;
  }

  set isFail(value) {
    if(value) {
      this.eventWordStatus.emit("isFail");
    }
    this._isFail = value;
  }

  clear() {
    console.log("Clear");
    this.inputBtnNotVisible = false;
    this.turingAnimation.clear();
    this.tsService.clear();
    this.input = "";
  }


  public sendStateDiagram( stateDiagram: Map<string,number>) {
    console.log("TsAnimation StateDiagram");
    let turingDiagram = new TuringDiagram();
    turingDiagram.stateDiagram = stateDiagram;
    this.eventStateDiagram.emit(turingDiagram);
  }

  public resetInputBtnVisible() {
    this.inputBtnNotVisible = false;
  }
}
