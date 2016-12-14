import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'ts-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements OnInit,OnChanges {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    beginAtZero:true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero:true
        }
      }]
    }
  };
  public barChartLabels:string[] = [];
  public barChartType:string = 'horizontalBar';
  public barChartLegend:boolean = true;

  public barChartData:number[] = [];

  @Input()
  stateDiagram = new Map<string,number>();

  ngOnChanges(changes: SimpleChanges) {
    // this.stateDiagram.forEach(
    //   (key,value) => {
    //
    //   }
    // )
    for(let change in changes) {

      console.log("Char OnChange");
      if (change.length > 1) {
        let data = [];
        this.stateDiagram.forEach((key, value) => {
          this.barChartLabels.push(String(value));

          data.push(key);
          console.log("State: " + value);
          console.log("Number: " + key);
        });

        this.barChartData = data;
        console.log(data);
        console.log(this.barChartLabels);
      }
    }
  }



  constructor() { }

  ngOnInit() {


  }

}
