import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import marked from 'marked';
import { BehaviorSubject, Subscription } from 'rxjs';

@Directive({
  selector: '[appMarkdown]'
})
export class MarkdownDirective {

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
    this.parsed = marked(text, {
      gfm: true,
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