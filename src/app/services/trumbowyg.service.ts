import { Injectable } from '@angular/core';
import turndown from 'turndown';
import { TrumbowygConstants } from '../constants/trymbowyg-constants';

declare var $: any;

@Injectable()
export class TrumbowygService {

    turndownService;

    trumbowygInstances = [];

    constructor() {
        this.turndownService = new turndown();
    }

    pushInstance(id) {
        this.trumbowygInstances.push(id);
    }

    destroyAllEditors() {
        this.trumbowygInstances.forEach(id => {
            this.destroyEditor(id);
        })
    }

    initEditor(trumbowygSelector: string, configs) {
        $(trumbowygSelector).trumbowyg(configs);
        this.pushInstance(trumbowygSelector);
    }

    public getTrumbowygContent(trumbowygSelector: string) {
        return $(trumbowygSelector).trumbowyg('html');
    }

    public getTrumbowygAsMarkdown(trumbowygSelector: string) {
        return this.turndownService.turndown(this.getTrumbowygContent(trumbowygSelector));
    }

    public clearPostEditor() {
        $(TrumbowygConstants.TRUMBOWYG_EDITOR).trumbowyg('empty');
    }

    public destroyEditor(trumbowygSelector: string) {
        $(trumbowygSelector).trumbowyg('destroy');
    }

}