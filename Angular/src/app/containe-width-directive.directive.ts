import {Directive, Renderer, ElementRef} from '@angular/core';

@Directive({
  selector: '[appContaineWidthDirective]'
})
export class ContaineWidthDirectiveDirective {

  private el: HTMLElement;
  private renderer: Renderer;

  constructor(el: ElementRef, renderer: Renderer) {
    this.el = el.nativeElement;
    this.renderer = renderer;
  }

  ngAfterViewInit() {

  }


}
