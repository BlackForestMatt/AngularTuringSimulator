import {Component, ViewContainerRef, OnInit} from '@angular/core';
import { Overlay } from 'angular2-modal';
import { Modal } from 'angular2-modal/plugins/bootstrap';

@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal) {
    overlay.defaultViewContainer = vcRef;
  }

  showImpressumDialog() {
    this.modal.alert()
      .size('lg')
      .showClose(true)
      .title('About')
      .body(`
      <p> Name: Josef Grieb </p>
      <p>Please send all suggestions,bugs feedback etc. to <a href="mailto:turingsimulator95@gmail.com">turingsimulator95@gmail.com</a>
         </p>   `)
      .open();
  }

  ngOnInit() {
  }

}
