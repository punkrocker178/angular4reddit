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
        $("#trumbowyg-content").trumbowyg({
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