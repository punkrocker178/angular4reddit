import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
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

    trumbowygConfigs = {
        isComment: true
    }

    constructor(
        private redditSubmitService: RedditSubmitService,
        private trumbowygService: TrumbowygService) {
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
        this.redditSubmitService.comment(thingID, id).subscribe(data => {
          this.cancelEditor();
              this.submittedComment.emit({
                data: data,
                kind: 't1'
              });
        });
    }
}