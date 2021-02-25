import { Component, Input } from '@angular/core';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';

@Component({
    selector: 'comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent {

    @Input() commentData;

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
        this.trumbowygService.destroyEditor(true, this.commentData.data.id);
        this.enableEditor = false;
    }

    replyComment(id: string, kind: string) {

        // const postId = `${kind}_${id}`;
        // this.redditSubmitService.comment(postId).subscribe(data => {
        //   this.enableEditor = false;
        //   this.comments.push({
        //     data: data,
        //     kind: 't1'
        //   });
        // });
    }
}