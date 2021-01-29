import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { createPopper } from '@popperjs/core';

@Directive({
  selector: '[appPopover]'
})
export class PopoverDirective {

  tooltipElement;

  // Needs to create config interface
  @Input() config;

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer2.setAttribute(this.tooltipElement, 'data-show', 'true');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer2.removeAttribute(this.tooltipElement, 'data-show');
  }

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2) { }

  ngOnInit() {
    this.tooltipElement = this.createTooltip();
    createPopper(this.el.nativeElement, this.tooltipElement, {
      placement: this.config.placement,
      modifiers: this.config.modifier
    });
  }

  createTooltip() {
    const tooltip = this.renderer2.createElement('div');
    const title = this.renderer2.createElement('h5');
    const body = this.renderer2.createElement('p');
    this.renderer2.appendChild(title, this.renderer2.createText(this.config.title));
    this.renderer2.appendChild(body, this.renderer2.createText(this.config.body));
    this.renderer2.appendChild(tooltip, title);
    this.renderer2.appendChild(tooltip, body);
    this.renderer2.setAttribute(tooltip, 'role', 'tooltip');
    this.renderer2.addClass(tooltip, 'popover-tooltip');
    this.renderer2.appendChild(this.el.nativeElement, tooltip);
    return tooltip;
  }


}