import {Component, OnInit, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {TuringmachineService} from "../turingmachineservice.service";

@Component({
  selector: 'app-turing-machine',
  templateUrl: './turing-machine.component.html',
  styleUrls: ['./turing-machine.component.css']
})
export class TuringMachineComponent implements AfterViewInit,OnChanges {
  private exampleCode:string = ""; //For passsing the messages
  private currentCode:string;
  private isPlayBtnVisible = true;
  constructor(private tsService: TuringmachineService) { }

  ngAfterViewInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
}


  setExample(example:string) {
    this.exampleCode = example;
  }

  codeChange(code:string) { //for any change on the editor
    this.currentCode = code;
  }

  compile() {
    this.tsService.compile(this.currentCode);
    if(this.tsService.isCompile) {
      this.isPlayBtnVisible = false;
    }
  }






}
