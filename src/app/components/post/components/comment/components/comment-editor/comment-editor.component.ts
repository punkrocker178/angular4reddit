import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, input } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { TrumbowygConfigs } from 'src/app/constants/trymbowyg-constants';
import { Post } from 'src/app/model/post';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { TrumbowygComponent } from 'src/app/shared/components/trumbowyg/trumbowyg.component';

@Component({
    selector: 'app-comment-editor',
    templateUrl: './comment-editor.component.html',
    standalone: false
})
export class CommentEditorComponent implements AfterViewInit, OnDestroy {

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

    readonly useMarkdown = input<boolean>(undefined);

    readonly trumbowygConfigs = input<TrumbowygConfigs>(undefined);

    readonly commentData = input<Post>(undefined);

    @Output() triggerCommentButton = new EventEmitter<boolean>();

    @ViewChild(TrumbowygComponent) trumbowygChild: TrumbowygComponent;
    @ViewChild('textAreaElement') textArea: ElementRef<HTMLTextAreaElement>;

    constructor(
        private checkDeviceFeatureService: CheckDeviceFeatureService,
        private trumbowygService: TrumbowygService
    ) { }

    ngAfterViewInit() {
        let editorInstance: ElementRef<HTMLElement>;

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

            const keyup$: Observable<Event> = fromEvent(editorInstance.nativeElement, 'keyup');

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
        return !this.checkDeviceFeatureService.isTouchScreen && !this.useMarkdown();
    }

    ngOnDestroy() {
        this.keyEventSubscribtion && this.keyEventSubscribtion.unsubscribe();
    }

}
