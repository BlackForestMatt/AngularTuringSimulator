import {Component, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import * as CodeMirror from 'codemirror';
import * as noUiSlider from 'nouislider';
import { ChartsModule } from 'ng2-charts/ng2-charts';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements AfterViewInit {
  context:CanvasRenderingContext2D;
  //private containerWidth: number = document.body.offsetWidth - 2;
  private containerWidth: number = 1500; //1500 must be dynamically
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
  rectColor:string =  "#0078FF";


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
        fill: "#428bca",
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


    var myCodeMirror = (CodeMirror as any).fromTextArea((document as any).getElementById('consoleCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    myCodeMirror.setSize(null,100);
    myCodeMirror.setValue("Test \ntestdfasdf");
    myCodeMirror.addLineClass(1,'Josef','CodeMirror-activeline-background');
    myCodeMirror.replace
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




    var myCodeMirror2 = (CodeMirror as any).fromTextArea((document as any).getElementById('editorCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    myCodeMirror2.setSize(null,390);
    myCodeMirror2.setValue("Test \n");









  }

  loadCodeMirror() {

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



  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A'}
  ];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  public randomize():void {
    // Only Change 3 values
    let data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    /**
     * (My guess), for Angular to recognize the change in the dataset
     * it has to change the dataset variable directly,
     * so one way around it, is to clone the data, change it and then
     * assign it;
     */
  }



}
