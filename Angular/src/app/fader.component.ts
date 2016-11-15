import {
  Component, OnChanges, Input,
  trigger, state, animate, transition, style
} from '@angular/core';

@Component({
  selector : 'my-fader',
  template: `
    <div [@visibilityChanged]="visibility" >
      <ng-content></ng-content>    
      <p>Can you see me? I should fade in or out...</p>
    </div>
  `,
  animations: [
    trigger('visibilityChanged', [
      state('shown1' , style({ opacity: 1 })),
      state('hidden1', style({ opacity: 0 })),
      transition('* => *', animate('100ms ease-out'))
    ])
  ]
})
export class FaderComponent implements OnChanges {
  @Input() isVisible : boolean = true;
  visibility = 'shown';

  ngOnChanges() {
    this.visibility = this.isVisible ? 'shown1' : 'hidden1';
  }
}
