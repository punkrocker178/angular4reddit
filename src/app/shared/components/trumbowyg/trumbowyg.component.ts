import { AfterViewInit, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { TrumbowygConfigs, TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { Subscription } from 'rxjs';
@Component({
    selector: 'app-trumbowyg-editor',
    templateUrl: './trumbowyg.component.html',
    standalone: false
})
export class TrumbowygComponent implements AfterViewInit {
    readonly configs = input<TrumbowygConfigs>(undefined);

    readonly editorId = input<string>(undefined);

    readonly triggerCommentButton = output<boolean>();

    keyEventSubscribtion: Subscription;
    private _trumbowygSelector: string;

    public get trumbowygSelector() {
        return this._trumbowygSelector;
    }

    readonly editorInstance = viewChild<ElementRef<HTMLElement>>('editor');
    readonly commentEditorInstance = viewChild<ElementRef<HTMLElement>>('commentEditorInstance');

    constructor(private trumbowygService: TrumbowygService) {

    }

    ngAfterViewInit() {
        const configs = this.configs();
        this._trumbowygSelector = configs && configs.isComment ?
        TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR + '-' + this.editorId(): TrumbowygConstants.TRUMBOWYG_EDITOR;

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
