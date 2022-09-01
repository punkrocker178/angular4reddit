import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { marked } from 'marked'
import { BehaviorSubject, Subscription } from 'rxjs';


/**
 * Since marked.js does not support Reddit's markdown flavour (Some post display weirdly)
 * This directive will be left unused
 */

@Directive({
  selector: '[appMarkdown]'
})
export class MarkdownDirective implements AfterViewInit, OnDestroy {

  private text$: BehaviorSubject<string> = new BehaviorSubject('');
  textSubscription: Subscription;
  private _selfText: string;
  @Input() set selfText(value: string) {
    this._selfText = value;
    this.text$.next(this._selfText);
  }
  parsed: string;

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2) { }

  ngAfterViewInit() {
    this.textSubscription = this.text$.subscribe(text => {
      if (text) {
        text = text.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
        this.parseMarkdown(text);
      }
    });

  }

  parseMarkdown(text: string) {
    this.parsed = marked.parse(text, {
      gfm: false,
      smartypants: true,
      smartLists: true
    });
    this.renderer2.setProperty(this.el.nativeElement, 'innerHTML', this.parsed);
  }

  ngOnDestroy() {
    this.text$.complete();
    this.textSubscription.unsubscribe();
  }
}
