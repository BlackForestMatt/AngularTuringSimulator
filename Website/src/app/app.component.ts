import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
    <app-turing-machine></app-turing-machine>

  `
})
export class AppComponent {
  isVisible : boolean = true;
  test5 : boolean = true;
}
