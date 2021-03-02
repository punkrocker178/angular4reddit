import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { TrumbowygComponent } from 'src/app/shared/components/trumbowyg/trumbowyg.component';

@Component({
    selector: 'comment-editor',
    templateUrl: './comment-editor.component.html'
})
export class CommentEditorComponent {

    postId: string;

    commentContent: string;

    keyEventSubscribtion: Subscription;

    disableCommentBtn: boolean;

    trumbowygConfigs = {
        isComment: true
    }

    @Input() commentData;

    @Output() triggerCommentButton = new EventEmitter();

    @ViewChild(TrumbowygComponent) trumbowygChild;
    @ViewChild('textAreaElement') textArea;

    constructor(
        private checkDeviceFeatureService: CheckDeviceFeatureService,

    ) { }


    ngAfterViewInit() {
        let editorInstance;

        if (this.checkDeviceFeatureService.isTouchScreen) {
            editorInstance = this.textArea;
        } else {
            editorInstance = this.trumbowygChild.editorInstance ?
            this.trumbowygChild.editorInstance : this.trumbowygChild.commentEditorInstance;
        }
        
        let keyup$;

        keyup$ = fromEvent(editorInstance.nativeElement, 'keyup');

        this.keyEventSubscribtion = keyup$.pipe(tap((event: any) => {
            if ((event.keyCode > 47 && event.keyCode < 91) ||
                (event.keyCode > 95 && event.keyCode < 112) ||
                (event.keyCode > 185 && event.keyCode < 223)) {
                this.disableCommentBtn = false;
            } else if (event.keyCode === 8 && (event.target.firstChild && event.target.firstChild.innerHTML == '<br>' || !event.target.firstChild)) {
                this.disableCommentBtn = true;
            };
        }), debounceTime(300)).subscribe(_ => {
            this.triggerCommentButton.emit(this.disableCommentBtn);
        });

    }

    useTrumbowygEditor() {
        return !this.checkDeviceFeatureService.isTouchScreen;
    }

    ngOnDestroy() {
        this.keyEventSubscribtion.unsubscribe();
    }

}