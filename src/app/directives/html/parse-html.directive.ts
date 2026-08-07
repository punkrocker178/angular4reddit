import { Directive, effect, ElementRef, input, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appHTML]',
    standalone: false
})
export class ParseHtmlDirective {

  readonly selfText = input<string>('');

  constructor(
    private el: ElementRef,
    private renderer2: Renderer2) {
      effect(() => {
        let text = this.selfText();
        if (!text) {
          return;
        }

        const regex = new RegExp(Object.keys(this.replaceChars).join('|'), 'g');
        text = text.replace(regex, (match) => this.replaceChars[match]);

        this.renderer2.setProperty(this.el.nativeElement, 'innerHTML', text);
      });
    }

    private replaceChars = {
        '&lt;':'<' ,
        '&gt;':'>',
        '&apos;': "'",
        '&quot;': '"',
        '&amp;': '&'
    };
}
