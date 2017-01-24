import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {ExampleData} from "../ExampleData";

@Component({
  selector: 'load-example',
  templateUrl: './load-example.component.html',
  styleUrls: ['./load-example.component.css']
})
export class LoadExampleComponent implements OnInit {

  @Output()
  onLoaded = new EventEmitter<Array<string>>(); //need for pass the data to EditorComponent

  private turingExamples = ['Delete a','Palindrome'];
  constructor() {


  }

  ngOnInit() {
  }

  public loadExample(example: string):void {

    switch(example) {
      case "Delete a":
        let loadExample = [example,ExampleData.deleteA];
        this.onLoaded.emit(loadExample);
        break;
      case "Palindrome":
        let palindrom = [example,ExampleData.palindrom];
        this.onLoaded.emit(palindrom);
      default:
        break;
    }


  }

}
