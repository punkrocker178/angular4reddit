import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
    selector: 'trumbowyg-editor',
    templateUrl: './trumbowyg.component.html'
})
export class TrumbowygComponent {
    @Input() configs;
    
    constructor() {

    }

    ngAfterViewInit() {
        $("trumbowyg-editor").trumbowyg({
            btns: [
                ['formatting'],
                ['strong', 'em', 'del'],
                ['superscript', 'subscript'],
                ['link'],
                ['unorderedList', 'orderedList'],
                ['horizontalRule'],
                ['removeformat']
            ]
        });
    }
}