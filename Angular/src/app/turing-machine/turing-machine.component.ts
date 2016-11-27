import {Component, OnInit, AfterViewInit, OnChanges} from '@angular/core';
import {TuringmachineService} from "../turingmachineservice.service";

@Component({
  selector: 'app-turing-machine',
  templateUrl: './turing-machine.component.html',
  styleUrls: ['./turing-machine.component.css']
})
export class TuringMachineComponent implements AfterViewInit,OnChanges {
  private exampleCode:string = ""; //For passsing the messages

  private currentCode:string;
  constructor(private tsService: TuringmachineService) { }

  ngAfterViewInit() {


  }

  ngOnChanges() {
    console.log("currentCode change");
}




  setExample(example:string) {
    this.exampleCode = example;
  }

  codeChange(code:string) {
    this.currentCode = code;
    console.log("CodeChanges!!");
  }

  compile() {
    //this.tsService.compile();
  }






}
