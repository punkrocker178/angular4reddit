import { Component, computed, input, output, viewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginPromptComponent } from 'src/app/components/modals/login-required/login-prompt.component';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { Post } from 'src/app/model/post';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    standalone: false
})
export class CommentComponent {

    readonly useMarkdown = input<boolean>(undefined);
    readonly commentData = input<Post>(undefined);
    readonly isArchive = input<boolean>(undefined);
    readonly originalPoster = input<string>(undefined);
    readonly submittedComment = output<Post>();

    readonly commentEditor = viewChild(CommentEditorComponent);

    enableEditor: boolean;
    disableReplyBtn = true;

    readonly isAuthorModerator = computed(() => {
        const distinguished = this.commentData()?.data.distinguished;
        return distinguished?.toLowerCase() === 'moderator';
    });

    trumbowygConfigs = {
        isComment: true
    }

    constructor(
        private redditSubmitService: RedditSubmitService,
        private trumbowygService: TrumbowygService,
        private checkDeviceFeatureService: CheckDeviceFeatureService,
        private authenticatedService: RedditAuthenticateService,
        private modalService: NgbModal) {
    }

    showReplyEditor() {
        if (!this.authenticatedService.getIsLoggedIn()) {
            this.modalService.open(LoginPromptComponent);
        } else {
            this.enableEditor = true;
        }

    }

    cancelEditor() {
        this.trumbowygService.destroyEditor(`${TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR}-${this.commentData().data.id}`);
        this.enableEditor = false;
    }

    replyComment(id: string, kind: string) {
        const thingID = `${kind}_${id}`;
        const trumbowygSelector = `${TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR}-${this.commentData().data.id}`;

        const content = !this.useTrumbowygEditor() ?
            this.commentEditor().commentContent : this.trumbowygService.getTrumbowygAsMarkdown(trumbowygSelector);

        const data = {
            thingID: thingID,
            content: content
        };
        this.redditSubmitService.comment(data).subscribe(data => {
            this.cancelEditor();
            this.submittedComment.emit({
                data: data,
                kind: 't1'
            } as Post);
        });
    }

    useTrumbowygEditor() {
        return !this.checkDeviceFeatureService.isTouchScreen && !this.useMarkdown();
    }

    displayReplyButton(value: boolean) {
        this.disableReplyBtn = value;
    }
}
