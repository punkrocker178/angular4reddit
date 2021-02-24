import { Injectable } from '@angular/core';
import turndown from 'turndown';

declare var $: any;

@Injectable()
export class TrumbowygService {

    turndownService;

    constructor() {
        this.turndownService = new turndown();
    }

    public getTrumbowygContent() {
        return $("#trumbowyg-content").trumbowyg('html');
    }

    public getTrumbowygAsMarkdown() {
        return this.turndownService.turndown(this.getTrumbowygContent());
    }

    public clearEditor() {
        $('#trumbowyg-content').trumbowyg('empty');
    }

}