import { Component, ElementRef, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
    selector: 'app-flair',
    templateUrl: './flair.component.html'
})
export class FlairComponent {

    @Input() flairInput;
    @ViewChild('flairElement') flairEl: ElementRef;
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
        if (this.flairInput['link_flair_background_color']) {
            this.renderer2.setStyle(this.flairEl.nativeElement, 'background-color', this.flairInput['link_flair_background_color']);
            this.renderer2.setStyle(this.flairEl.nativeElement, 'border-color', this.flairInput['link_flair_background_color']);
            this.renderer2.setStyle(this.flairEl.nativeElement, 'color', '#FFFFFF');
        }
    }

    hasFlair() {
        return this.flairInput['link_flair_text'] ||
            (this.flairInput['link_flair_richtext'] && this.flairInput['link_flair_richtext'].length > 0);
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

        if (this.flairInput['link_flair_richtext'].length > 1) {
            const flairRichText = this.flairInput['link_flair_richtext'];
            const flairArr = flairRichText.filter(part => part['e'] === 'text');
            if (flairArr.length > 0) {
                flairText = flairArr[0]['t'].replace(regex, (match) => replaceObj[match]);
            }
            return flairText;
        }

        flairText = this.flairInput['link_flair_text'].replace(regex, (match) => replaceObj[match]);
        return flairText;
    }

    getEmojiFlair() {
        return (this.flairInput['link_flair_richtext'][0] && this.flairInput['link_flair_richtext'][0]['u']);
    }

    flairHasEmoji() {
        if (this.flairInput['link_flair_richtext'] && this.flairInput['link_flair_richtext'].length == 0) {
            return false;
        }

        const flair = this.flairInput['link_flair_richtext'];
        return flair &&
            flair.length > 1 &&
            flair[0]['e'] === 'emoji';
    }


}