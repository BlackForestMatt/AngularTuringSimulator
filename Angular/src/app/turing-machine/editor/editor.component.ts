import {Component, OnInit, Input, OnChanges, Output,EventEmitter} from '@angular/core';
import * as CodeMirror from 'codemirror';
import {Subscription} from "rxjs";
import {TuringmachineService} from "../../turingmachineservice.service";

@Component({
  selector: 'ts-editor',
  templateUrl: 'editor.component.html',
  styleUrls: ['editor.component.css']
})
export class EditorComponent implements OnInit,OnChanges {
  private editor;

  private subscription: Subscription;
  private value: string;

  @Input()
  private exampleData = "";

  @Output()
  static codeChanges = new EventEmitter<string>();

  constructor(private tsService: TuringmachineService) {
    //this.exampleData.subscribe( (param:any) => console.log("ExampleData"));
  }

  ngOnChanges() {
    if(this.exampleData !== "") {
      console.log("OnChangesEditor");
      this.editor.setValue(this.exampleData);

    }


  }

  ngOnInit() {
    console.log("ngOnInit");
    this.editor = (CodeMirror as any).fromTextArea((document as any).getElementById('editorCM'), {
      mode: "text/html",
      lineNumbers: true
    });

    var t = document.getElementById('editorCM');

    this.editor.setSize(null,390);

    this.editor.on('change',this.change);
  }


   change(cMirror){ //JavaScript function!!
    // get value right from instance
    let code = cMirror.getValue();
    EditorComponent.codeChange(code);
  }


  private static codeChange(code:string) { //static because of the function "change()"
    console.log("EditorCodeChange");
    this.codeChanges.emit(code);
  }

}
