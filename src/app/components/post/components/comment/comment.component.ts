import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent {

    @Input() commentData;
    @Output() submittedComment: EventEmitter<Object> = new EventEmitter();

    enableEditor: boolean;
    disableReplyBtn = true;
    commentContent: string;

    trumbowygConfigs = {
        isComment: true
    }

    constructor(
        private redditSubmitService: RedditSubmitService,
        private trumbowygService: TrumbowygService,
        private checkDeviceFeatureService: CheckDeviceFeatureService) {
    }

    ngOnInit() {
    }

    showReplyEditor() {
        this.enableEditor = true;
    }

    cancelEditor() {
        this.trumbowygService.destroyEditor(`${TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR}-${this.commentData.data.id}`);
        this.enableEditor = false;
    }

    replyComment(id: string, kind: string) {
        const thingID = `${kind}_${id}`;
        const content  = {
            thingID: thingID,
            content: this.commentContent ? this.commentContent : null
        };
        this.redditSubmitService.comment(content, id).subscribe(data => {
          this.cancelEditor();
              this.submittedComment.emit({
                data: data,
                kind: 't1'
              });
        });
    }

    useTrumbowygEditor() {
        return !this.checkDeviceFeatureService.isTouchScreen;
    }

    displayReplyButton(value: boolean) {
        this.disableReplyBtn = value;
    }
}