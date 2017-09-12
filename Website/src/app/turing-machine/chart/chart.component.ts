import {Component, OnInit, Input, SimpleChanges, OnChanges} from '@angular/core';

@Component({
  selector: 'ts-chart',
  templateUrl: 'chart.component.html',
  styleUrls: ['chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true,
    beginAtZero: true,
    scales: {
      xAxes: [{
        ticks: {
          beginAtZero: true,
          scaleStepWidth: 1
        }
      }]
    }
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'horizontalBar';
  public barChartLegend: boolean = true;
  public chartColors: Array<any> = [
    {
      backgroundColor: 'rgba(35, 47, 57, 1)',
      borderColor: 'rgba(35, 47, 57, 1)',
      pointHoverBackgroundColor: 'rgba(35, 47, 57, 1)',
      pointHoverBorderColor: 'rgba(35, 47, 57, 1)'
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
        });

        let clone = JSON.parse(JSON.stringify(this.barChartData));
        clone[0].data = data;
        this.barChartData = clone;
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
