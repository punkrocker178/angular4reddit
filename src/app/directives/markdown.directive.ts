import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import marked from 'marked';

@Directive({
  selector: '[appMarkdown]'
})
export class MarkdownDirective {

  @Input() selfText: string;
  parsed: string;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2) {}

  ngAfterViewInit() {
    this.parseMarkdown();
  }

  parseMarkdown() {
    if (this.selfText) {
      this.parsed = marked(this.selfText, {
        gfm: true,
        smartypants: true,
        smartLists: true
      });
      this.renderer2.setProperty(this.el.nativeElement, 'innerHTML', this.parsed);
    }
  }
}