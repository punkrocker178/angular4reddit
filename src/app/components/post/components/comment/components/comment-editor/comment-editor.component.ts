import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { TrumbowygComponent } from 'src/app/shared/components/trumbowyg/trumbowyg.component';

@Component({
    selector: 'comment-editor',
    templateUrl: './comment-editor.component.html'
})
export class CommentEditorComponent {

    postId: string;

    _commentContent = '';

    public get commentContent() {
        return this._commentContent;
    }

    public set commentContent(data: string) {
        this._commentContent = data;
    }

    keyEventSubscribtion: Subscription;

    disableCommentBtn: boolean;

    @Input() useMarkdown: boolean;

    @Input() trumbowygConfigs;

    @Input() commentData;

    @Output() triggerCommentButton = new EventEmitter();

    @ViewChild(TrumbowygComponent) trumbowygChild;
    @ViewChild('textAreaElement') textArea;

    constructor(
        private checkDeviceFeatureService: CheckDeviceFeatureService,
        private trumbowygService: TrumbowygService
    ) { }

    ngAfterViewInit() {
        let editorInstance;

        if (!this.useTrumbowygEditor()) {
            editorInstance = this.textArea;

            const keyEvent$ = fromEvent(editorInstance.nativeElement, 'keydown');
            this.keyEventSubscribtion = keyEvent$.pipe(debounceTime(300)).subscribe(_ => {

                const content = this._commentContent ? this._commentContent.replace(/\s+/g, '') : '';

                if (content.length > 0) {
                    this.disableCommentBtn = false;
                } else {
                    this.disableCommentBtn = true;
                }

                this.triggerCommentButton.emit(this.disableCommentBtn);
            });
        } else {
            editorInstance = this.trumbowygChild.editorInstance ?
                this.trumbowygChild.editorInstance : this.trumbowygChild.commentEditorInstance;

            let keyup$;

            keyup$ = fromEvent(editorInstance.nativeElement, 'keyup');

            this.keyEventSubscribtion = keyup$.pipe(debounceTime(300)).subscribe(_ => {
                const content = this.trumbowygService.getTrumbowygAsMarkdown(this.trumbowygChild.trumbowygSelector);

                if (content.length > 0) {
                    this.disableCommentBtn = false;
                } else {
                    this.disableCommentBtn = true;
                }

                this.triggerCommentButton.emit(this.disableCommentBtn);
            });
        }

    }

    useTrumbowygEditor() {
        return !this.checkDeviceFeatureService.isTouchScreen && !this.useMarkdown;
    }

    ngOnDestroy() {
        this.keyEventSubscribtion && this.keyEventSubscribtion.unsubscribe();
    }

}