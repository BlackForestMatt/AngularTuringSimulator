import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import * as CodeMirror from 'codemirror';
import * as noUiSlider from 'nouislider';
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements AfterViewInit {
  context:CanvasRenderingContext2D;
  private containerWidth: number = document.body.offsetWidth - 2;
  private cellSize: number;       //sq_size
  private nCell: number = 50;
  private containerHeight: number;
  private current_despl: number = 0;
  private rectGroup;
  private first_displayed = 0;
  public visible  = true;

  x: number;
  x2:number;
  y: number;
  rectColor:string = "#0078FF";



  constructor() { }

  ngAfterViewInit() {
    //let canvas = this.myCanvas.nativeElement;
    //this.context = canvas.getContext("2d");

    this.kinetic();
  }

  kinetic() {
    this.cellSize = this.containerWidth / (25 - 2);
    this.containerHeight = this.cellSize * 2;

    var stage = new Kinetic.Stage({ //height => 0 wird nicht angezeigt!!!
      container: 'container2',
      width: this.containerWidth,
      height: this.containerHeight
    });
    var layer = new Kinetic.Layer();
    this.rectGroup = new Kinetic.Group({

    });

    this.x = 0;
    this.y = (this.containerHeight - this.cellSize) / 2; //Mitte
    for( var i = 0; i <= this.nCell; i++) {


      var rectangle = new Kinetic.Rect({

        x: this.cellSize * (i-1),
        y: this.y,
        width: this.cellSize,
        height: this.cellSize,
        fill: "blue",
        stroke: "white",
        strokeWidth: 2,
        cornerRadius: 2

      });
      this.x = this.x + this.cellSize + 20;

      this.rectGroup.add(rectangle);

    }

    var pos_y = ((0.1) + (4/3)) * this.cellSize - this.cellSize/6;
    var poly = new Kinetic.RegularPolygon({
      x: (this.containerWidth/2),
      y: (pos_y + 2 * this.cellSize/5),
      sides: 3,
      radius: (this.cellSize/3),
      fill: "#000",
      stroke: "#000",
      strokeWidth: (4*2/3)
    });
    layer.add(this.rectGroup);
    layer.add(poly);
    stage.add(layer);


    var myCodeMirror = (CodeMirror as any).fromTextArea((document as any).getElementById('code_editor'), {
      mode: "text/html",
      lineNumbers: true
    });

    myCodeMirror.setSize(null,100);
    myCodeMirror.setValue("Test \ntestdfasdf");

    //manage speed
    var speed_bar = document.getElementById('slider');


    (noUiSlider as any).create(speed_bar, {
      start: 50,
      connect: [true, false],
      orientation: "horizontal",
      range: {
        'min': 0,
        'max': 170
      },
    });







  }


  animate() {
    var direction = -1; //Parameter -1 or 1

    this.first_displayed=(this.first_displayed - direction + this.nCell) % this.nCell;
    this.current_despl = this.current_despl + direction * this.cellSize;

    var to_move = (this.first_displayed - 1 + this.nCell) % this.nCell;
    console.log(to_move);
    var target_position = -this.current_despl + (this.nCell - 2) * this.cellSize;
    var square_to_move = this.rectGroup.getChildren()[to_move];

    console.log(this.current_despl);


    var tween_squares = new (Kinetic as any).Tween({
      node: this.rectGroup,
      x: this.current_despl,
      duration: 2,
      easing: (Kinetic as any).Easings.EaseInOut,
      onFinish: function(){

        //(square_to_move as any).setX(target_position);
      }
    });



    tween_squares.play();


  }



}
