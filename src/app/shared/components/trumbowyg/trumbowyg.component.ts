import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
    selector: 'trumbowyg-editor',
    templateUrl: './trumbowyg.component.html'
})
export class TrumbowygComponent {
    @Input() configs;

    @Input() editorId;
    
    constructor() {

    }

    ngAfterViewInit() {
        const trumbowygEditor = this.configs && this.configs.isComment ? 
        '#trumbowyg-comment-content-' + this.editorId: '#trumbowyg-content';
        $(trumbowygEditor).trumbowyg({
            btns: [
                ['formatting'],
                ['strong', 'em'],
                ['link'],
                ['unorderedList', 'orderedList'],
                ['horizontalRule'],
                ['removeformat']
            ]
        });
    }
}