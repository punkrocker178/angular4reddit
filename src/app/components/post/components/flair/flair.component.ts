import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, input, viewChild } from '@angular/core';
import { FlairData } from 'src/app/model/post';

@Component({
    selector: 'app-flair',
    templateUrl: './flair.component.html',
    standalone: false
})
export class FlairComponent implements OnInit, AfterViewInit {

    readonly flairInput = input<FlairData>(undefined);
    readonly flairEl = viewChild<ElementRef>('flairElement');
    flairText: string;
    flairEmoji: string;

    constructor(private renderer2: Renderer2) { }

    ngOnInit() {
        if (this.hasFlair()) {
            this.flairText = this.getFlair();
        }

        if (this.flairHasEmoji()) {
            this.flairEmoji = this.getEmojiFlair();
        }
    }

    ngAfterViewInit() {
        const flairInput = this.flairInput();
        if (flairInput['flair_background_color']) {
            const flairEl = this.flairEl();
            this.renderer2.setStyle(flairEl.nativeElement, 'background-color', flairInput['flair_background_color']);
            this.renderer2.setStyle(flairEl.nativeElement, 'border-color', flairInput['flair_background_color']);
            this.renderer2.setStyle(flairEl.nativeElement, 'color', '#FFFFFF');
            this.renderer2.setStyle(flairEl.nativeElement, 'text-shadow', 'black 0 0');
        }
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
