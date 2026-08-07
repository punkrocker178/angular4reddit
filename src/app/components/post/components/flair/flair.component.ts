import { Component, computed, effect, ElementRef, Renderer2, input, viewChild } from '@angular/core';
import { FlairData } from 'src/app/model/post';

@Component({
    selector: 'app-flair',
    templateUrl: './flair.component.html',
    standalone: false
})
export class FlairComponent {

    readonly flairInput = input<FlairData>(undefined);
    readonly flairEl = viewChild<ElementRef>('flairElement');

    readonly flairText = computed(() => {
        if (!this.hasFlair()) {
            return undefined;
        }
        return this.getFlair();
    });

    readonly flairEmoji = computed(() => {
        if (!this.flairHasEmoji()) {
            return undefined;
        }
        return this.getEmojiFlair();
    });

    constructor(private renderer2: Renderer2) {
        effect(() => {
            const flair = this.flairInput();
            const el = this.flairEl();
            if (!flair || !el) {
                return;
            }
            if (flair['flair_background_color']) {
                this.renderer2.setStyle(el.nativeElement, 'background-color', flair['flair_background_color']);
                this.renderer2.setStyle(el.nativeElement, 'border-color', flair['flair_background_color']);
                this.renderer2.setStyle(el.nativeElement, 'color', '#FFFFFF');
                this.renderer2.setStyle(el.nativeElement, 'text-shadow', 'black 0 0');
            }
        });
    }

    hasFlair() {
        const flairInput = this.flairInput();
        return flairInput['flair_text'] ||
            (flairInput['flair_richtext'] && flairInput['flair_richtext'].length > 0);
    }

    getFlair() {
        // Replace encoded special characters
        const replaceObj = {
            '&amp;': '&',
            '&gt;': '>',
            '&lt;': '<',
            '&quot': '"'
        }

        const regex = new RegExp(Object.keys(replaceObj).join('|'), 'g');

        let flairText;


        if (this.flairInput()['flair_richtext'].length > 0) {
            const flairRichText = this.flairInput()['flair_richtext'];
            const flairArr = flairRichText.filter(part => part['e'] === 'text');
            if (flairArr.length > 0) {
                flairText = flairArr[0]['t'].replace(regex, (match) => replaceObj[match]);
            }
            return flairText;
        }

        flairText = this.flairInput()['flair_text'].replace(regex, (match) => replaceObj[match]);
        return flairText;
    }

    getEmojiFlair() {
        const flairInput = this.flairInput();
        return (flairInput['flair_richtext'][0] && flairInput['flair_richtext'][0]['u']);
    }

    flairHasEmoji() {
        const flairInput = this.flairInput();
        if (flairInput['flair_richtext'] && flairInput['flair_richtext'].length == 0) {
            return false;
        }

        const flair = flairInput['flair_richtext'];
        return flair &&
            flair.length > 1 &&
            flair[0]['e'] === 'emoji';
    }

}
