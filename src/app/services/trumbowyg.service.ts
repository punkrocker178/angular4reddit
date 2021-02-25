import { Injectable } from '@angular/core';
import turndown from 'turndown';

declare var $: any;

@Injectable()
export class TrumbowygService {

    turndownService;

    constructor() {
        this.turndownService = new turndown();
    }

    private getTrumbowygSelector(isComment: boolean, editorId: string) {
        return isComment ? '#trumbowyg-comment-content-' + editorId : '#trumbowyg-content';
    }

    public getTrumbowygContent(isComment?: boolean, editorId?: string) {
        const selector = this.getTrumbowygSelector(isComment, editorId);
        return $(selector).trumbowyg('html');
    }

    public getTrumbowygAsMarkdown(isComment?: boolean) {
        return this.turndownService.turndown(this.getTrumbowygContent(isComment));
    }

    public clearEditor(isComment?: boolean, editorId?: string) {
        const selector = this.getTrumbowygSelector(isComment, editorId);
        $(selector).trumbowyg('empty');
    }

    public destroyEditor(isComment?: boolean, editorId?: string) {
        const selector = this.getTrumbowygSelector(isComment, editorId);
        $(selector).trumbowyg('destroy');
    }

}