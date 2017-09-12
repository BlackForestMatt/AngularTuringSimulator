import {Component, OnInit, Input, OnChanges, Output,EventEmitter} from '@angular/core';
import {Subscription} from 'rxjs';
import {TuringmachineService} from '../../service/turingmachineservice.service';
import * as CodeMirror from "codemirror";


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
  private codeChanges = new EventEmitter<string>();

  constructor(private tsService: TuringmachineService) {
  }

  ngOnChanges() {
    if(this.exampleData !== "") {
      this.editor.setValue(this.exampleData);
    }
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.editor = (CodeMirror as any).fromTextArea((document as any).getElementById('editorCM'), {
      mode: 'text/html',
      lineNumbers: true
    });

    this.editor.setSize(null,390);

    this.editor.on('change', (editor: CodeMirror.Editor) => {
      let code = editor.getDoc().getValue();
      this.codeChange(code);
    });

  }

   codeChange(code:string) { // static because of the function "change()"
    console.log('EditorCodeChange');
    this.codeChanges.emit(code);
  }


}
