import { Directive, ElementRef } from '@angular/core';
declare var $: any;

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective {
  constructor(er: ElementRef) {
    $(er.nativeElement).tooltip();
  }
}