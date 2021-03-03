import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
declare var $: any;

@Component({
    selector: 'trumbowyg-editor',
    templateUrl: './trumbowyg.component.html'
})
export class TrumbowygComponent {
    @Input() configs;

    @Input() editorId;

    @Output() triggerCommentButton = new EventEmitter();

    keyEventSubscribtion: Subscription;
    private _trumbowygSelector: string;

    public get trumbowygSelector() {
        return this._trumbowygSelector;
    }

    @ViewChild('editor') editorInstance: ElementRef;
    @ViewChild('commentEditorInstance') commentEditorInstance: ElementRef;
    
    constructor(private trumbowygService: TrumbowygService) {

    }

    ngAfterViewInit() {
        this._trumbowygSelector = this.configs && this.configs.isComment ? 
        TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR + '-' + this.editorId: TrumbowygConstants.TRUMBOWYG_EDITOR;
        
        this.trumbowygService.initEditor(this._trumbowygSelector, 
            {
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