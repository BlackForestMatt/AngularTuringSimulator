import {Component, OnInit, AfterViewInit, OnChanges, SimpleChanges} from '@angular/core';
import {TuringDiagram} from "../TuringDiagram";
import {TuringmachineService} from "../service/turingmachineservice.service";

@Component({
  selector: 'app-turing-machine',
  templateUrl: './turing-machine.component.html',
  styleUrls: ['./turing-machine.component.css']
})
export class TuringMachineComponent implements AfterViewInit,OnChanges {
  private exampleCode:string = ""; //For passsing the messages
  private currentCode:string;
  private isPlayBtnVisible = true;
  private isCompileError = false;
  private errorMessage = "";
  private stateDiagram = new Map<string,number>();
  private isSuccess = false;
  private isFail = false;
  private exampleName:string;


  constructor(private tsService: TuringmachineService) { }

  ngAfterViewInit() {


  }

  ngOnChanges(changes: SimpleChanges) {
}


  setLoadExample(example:Array<string>) {
    this.exampleCode = example[1];
    this.exampleName = example[0];

  }

  codeChange(code:string) { //for any change on the editor
    this.currentCode = code;
  }

  compile() {
    this.tsService.compile(this.currentCode);
    if(this.tsService.isCompile) {
      this.isPlayBtnVisible = false;
      this.isCompileError = false;
    } else {
      this.errorMessage = this.tsService.errorCompileMessage;
      this.isCompileError = true;
    }
  }

  public setStateDiagram(turingDiagram : TuringDiagram) {
    this.stateDiagram = turingDiagram.stateDiagram;
  }

  public setWordStatus(status:string) {
    if(status === "isSuccess") {
      this.isSuccess = true;
    } else if(status === "isFail") {
      this.isFail = true;
    }
  }






}
