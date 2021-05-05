import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Directive({
  selector: '[appHTML]'
})
export class ParseHtmlDirective {

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

    private replaceChars = {
        '&lt;':'<' ,
        '&gt;':'>',
        '&apos;': "'",
        '&quot;': '"',
        '&amp;': '&'
    };

  ngAfterViewInit() {
    this.textSubscription = this.text$.subscribe(text => {
      if (text) {

        let regex = new RegExp(Object.keys(this.replaceChars).join('|'), 'g');
        text = text.replace(regex,(match) => {
            return this.replaceChars[match];
        });

        this.renderer2.setProperty(this.el.nativeElement, 'innerHTML', text);
      }
    });

  }

  ngOnDestroy() {
    this.text$.complete();
    this.textSubscription.unsubscribe();
  }
}