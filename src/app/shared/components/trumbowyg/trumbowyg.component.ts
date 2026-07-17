import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TrumbowygConfigs, TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-trumbowyg-editor',
    templateUrl: './trumbowyg.component.html'
})
export class TrumbowygComponent implements AfterViewInit {
    @Input() configs?: TrumbowygConfigs;

    @Input() editorId?: string;

    @Output() triggerCommentButton = new EventEmitter<boolean>();

    keyEventSubscribtion: Subscription;
    private _trumbowygSelector: string;

    public get trumbowygSelector() {
        return this._trumbowygSelector;
    }

    @ViewChild('editor') editorInstance: ElementRef<HTMLElement>;
    @ViewChild('commentEditorInstance') commentEditorInstance: ElementRef<HTMLElement>;

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
