import {Component, OnInit, AfterViewInit, ViewChild, ElementRef, AfterContentInit} from '@angular/core';
import * as CodeMirror from 'codemirror';
import * as noUiSlider from 'nouislider';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {TuringmachineService} from "./service/turingmachineservice.service";



@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html'
})
export class CanvasComponent implements AfterViewInit,AfterContentInit,OnInit {



  private example1 = "blank := _; / symbol to use as blank \n " +
    "start := s0; / set start newState \n" +
    "end := {s5}; \n" +
    "/ transition function \n" +
    "s0, a -> s1, a, >; \n" +
    "s0, b -> s0, b, >; \n" +
    "s0, _ -> s5, _, <; \n" +
    "s1, a -> s1, a, >; \n" +
    "s1, b -> s2, a, <; \n" +
    "s1, _ -> s4, _, <; \n" +
    "s2, a -> s2, a, <; \n" +
    "s2, b -> s3, b, >; \n" +
    "s2, _ -> s3, _, >; \n" +
    "s3, a -> s0, b, >; \n" +
    "s4, a -> s4, _, <; \n" +
    "s4, b -> s4, b, <; \n"+
    "s4, _ -> s5, _, >; \n";
  //private containerWidth: number = document.body.offsetWidth - 2;
  private containerWidth: number; //1500 must be dynamically
  private cellSize: number;       //sq_size
  private nCell: number = 30;
  private containerHeight: number;
  private current_despl: number = 0;
  private rectGroup;
  private symbolGroup;
  private first_displayed = 0;
  public visible  = true;
  private trans_speed: number = 1.0001;
  public inputData: string = "";
  private layer;
  private middleTape: number;
  x: number;
  x2:number;
  y: number;
  rectColor:string =  '#0078FF';
  private editor;




  constructor(private tsService: TuringmachineService) { }

  ngAfterViewInit() {
    console.log("ngAfterViewInit");

    this.containerWidth = document.getElementById("container2").offsetWidth;
    this.containerWidth -=  this.containerWidth * 0.006024;

    console.log(this.containerWidth);
    this.kinetic();
  }

  ngAfterContentInit() {
    console.log("ngAfterContentInit");
  }

  ngOnInit() {
    console.log("ngOnInit");
  }



  kinetic() {
    this.cellSize = this.containerWidth / (25 - 2);
    this.containerHeight = this.cellSize * 2;

    let stage = new Kinetic.Stage({ //height => 0 wird nicht angezeigt!!!
      container: 'container2',
      width: this.containerWidth,
      height: this.containerHeight
    });
    this.layer = new Kinetic.Layer();
    this.rectGroup = new Kinetic.Group({});
    this.symbolGroup = new Kinetic.Group({});

    this.x = 0;
    this.y = (this.containerHeight - this.cellSize) / 2; //Mitte
    let middle = this.containerWidth / 2;

    for( let i = 0; i <= this.nCell; i++) {

      this.x = this.cellSize * (i-1);

      let rectangle = new Kinetic.Rect({
        x: this.x,
        y: this.y,
        width: this.cellSize,
        height: this.cellSize,
        fill: '#428bca',
        stroke: 'white',
        strokeWidth: 2,
        cornerRadius: 2
      });

      if(((this.x + this.cellSize) >= middle) && (this.x <= middle)) {
          this.middleTape = i;
      }

      let symbol = new Kinetic.Text({
        x: this.cellSize * (i-1),
        y: this.y + (this.cellSize/6),
        fill: "white",
        text: " ",
        fontSize: (2 * this.cellSize/3) - (2 * this.cellSize/3) * 0.02,
        fontFamily: 'Helvetica',
        height: this.cellSize,
        width: this.cellSize,
        align: 'center',
      });


      this.x = this.x + this.cellSize + 20;

      this.rectGroup.add(rectangle);
      this.symbolGroup.add(symbol);

    }

    let pos_y = ((0.1) + (4/3)) * this.cellSize - this.cellSize/6;

    let poly = new Kinetic.RegularPolygon({
      x: (this.containerWidth/2),
      y: (pos_y + 2 * this.cellSize/5),
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


    let myCodeMirror = (CodeMirror as any).fromTextArea((document as any).getElementById('consoleCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    myCodeMirror.setSize(null,100);
    myCodeMirror.setValue("Test \ntestdfasdf");
    myCodeMirror.addLineClass(1,'Josef','CodeMirror-activeline-background');

    //manage speed
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




    this.editor = (CodeMirror as any).fromTextArea((document as any).getElementById('editorCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    this.editor.setSize(null,390);
    //this.editor.setValue("Test \n");
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
  }

  public loadInputData(data: string):void {

    let group = this.symbolGroup.getChildren();

    for (let i = 0; i < data.length; i++) {
      let char = data.charAt(i);
      group[this.middleTape+i].setText(char);
    }
    this.layer.draw();

  }

  public loadExample(data: string):void {
    if(data === "Example1") {
      this.editor.setValue(this.example1);
    }

    console.log("LoadExample");
    //this.tsService.compile(this.example1);
    //this.tsService.start();

  }



}
