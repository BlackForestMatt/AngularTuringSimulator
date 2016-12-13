import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'ts-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements OnInit,OnChanges {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = [];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [], label: 'Series A'}
  ];

  @Input()
  stateDiagram = new Map<string,number>();

  ngOnChanges(changes: SimpleChanges) {
    // this.stateDiagram.forEach(
    //   (key,value) => {
    //
    //   }
    // )
    console.log("Char OnChange");
    let states = this.stateDiagram.keys();
    console.log(this.stateDiagram);
    let data = [];

    this.stateDiagram.forEach( (key,value) => {
      this.barChartLabels.push(String(value));

      data.push(key);
      console.log("State: "+value);
      console.log("Number: "+key);
    });
    console.log(data);
    console.log(this.barChartLabels);
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
    console.log(this.barChartData);
  }



  constructor() { }

  ngOnInit() {


  }

}
