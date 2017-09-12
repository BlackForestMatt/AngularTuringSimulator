
import { Component, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/modal-options.class';


@Component({
  selector: 'app-about',
  templateUrl: 'about.component.html',
  styleUrls: ['about.component.css']
})
export class AboutComponent  {

  public modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  public showImpressumDialog(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

}
