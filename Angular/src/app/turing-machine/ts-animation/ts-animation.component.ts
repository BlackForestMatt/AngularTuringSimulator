import {Component, OnInit, AfterViewInit} from '@angular/core';
import * as CodeMirror from 'codemirror';
import * as noUiSlider from 'nouislider';
import {TuringAnimation} from "./TuringAnimation";

@Component({
  selector: 'ts-animation',
  templateUrl: './ts-animation.component.html',
  styleUrls: ['./ts-animation.component.css']
})
export class TsAnimationComponent implements OnInit {

  private turingAnimation: TuringAnimation;

  constructor() { }

  ngOnInit() {

    this.turingAnimation = new TuringAnimation();
    this.turingAnimation.init();
    this.init();
  }



  init() {
    let myCodeMirror = (CodeMirror as any).fromTextArea((document as any).getElementById('consoleCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    myCodeMirror.setSize(null,100);
    myCodeMirror.setValue("Test \ntestdfasdf");
    myCodeMirror.addLineClass(1,'Josef','CodeMirror-activeline-background');

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

    (speed_bar as any).noUiSlider.on('slide', function(){
      this.trans_speed = 2.0001 - (2 * (speed_bar as any).noUiSlider.get())/100;
      console.log(this.trans_speed);
    });



  }











}
