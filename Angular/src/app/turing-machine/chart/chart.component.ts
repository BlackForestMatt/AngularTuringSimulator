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
  public chartColors: Array<any> = [
    { // first color
      backgroundColor: 'rgba(231, 201, 12, 1)',
      borderColor: 'rgba(231, 201, 12, 1)',
      pointHoverBackgroundColor: 'rgba(231, 201, 12, 1)',
      pointHoverBorderColor: 'rgba(231, 201, 12, 1)'

    }];

  public barChartData:any[] = [
    {data:[],
      label: 'States'
    }
  ];

  @Input()
  stateDiagram = new Map<string,number>();

  ngOnChanges(changes: SimpleChanges) {

    for(let change in changes) {
      this.clearCharData();

      if (change.length > 1) {
        let data = [];
        this.stateDiagram.forEach((key, value) => {
          this.barChartLabels.push(String(value));

          data.push(key);
          console.log("State: " + value);
          console.log("Number: " + key);
        });

        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
        console.log(this.barChartData);
        console.log(this.barChartLabels);
      }
    }
  }

  public clearCharData() {
    let clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = [];
    this.barChartData = clone;
    this.barChartLabels = [];
  }



  constructor() { }

  ngOnInit() {


  }

}
