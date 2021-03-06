/**
 *
 *  This directive use popperjs library to create a popover. I'm using popper's Virtual element instead of HTMLElement
 *  because the position of the popover is got offset very far from the target element
 *  I can't figured out why.
 *
 */

import { AfterViewInit, Directive, ElementRef, HostListener, Input, OnDestroy, Renderer2 } from '@angular/core';
import { createPopper, VirtualElement } from '@popperjs/core';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective implements AfterViewInit, OnDestroy {

  tooltipElement;

  // Needs to create config interface
  @Input() config;
  @Input() tooltip?: HTMLElement;

  popoverInstance;

  virtualElement: VirtualElement = {
    getBoundingClientRect: this.generateGetBoundingClientRect()
  }

  // Reference from https://popper.js.org/docs/v2/virtual-elements/
  @HostListener('mousemove', ['$event']) onMousemove(event) {
    this.virtualElement.getBoundingClientRect = this.generateGetBoundingClientRect(event.clientX, event.clientY);
    this.popoverInstance.update();
    this.renderer2.setAttribute(this.tooltip, 'data-show', 'true');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer2.removeAttribute(this.tooltip, 'data-show');
  }

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2) { }

  ngAfterViewInit() {

    this.popoverInstance = createPopper(this.virtualElement, this.tooltip, {
      placement: this.config.placement,
      modifiers: [{
        name: 'offset',
        options: {
        offset: [0, 20],
      },
      }]
    });

  }

  generateGetBoundingClientRect(x = 0, y = 0): () => DOMRect {
    return () => ({
      width: 0,
      height: 0,
      top: y,
      right: x,
      bottom: y,
      left: x,
      x: y,
      y: y,
      toJSON: () => {}
    });
  }

  ngOnDestroy() {
    this.popoverInstance.destroy();
  }

}
