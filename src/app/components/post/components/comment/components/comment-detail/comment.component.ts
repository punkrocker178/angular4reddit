import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginPromptComponent } from 'src/app/components/modals/login-required/login-prompt.component';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { CommentEditorComponent } from '../comment-editor/comment-editor.component';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html'
})
export class CommentComponent {

    @Input() commentData;
    @Input() isArchive: boolean;
    @Output() submittedComment: EventEmitter<Object> = new EventEmitter();

    @ViewChild(CommentEditorComponent) commentEditor;

    enableEditor: boolean;
    disableReplyBtn = true;

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

    ngOnInit() {
    }

    showReplyEditor() {
        if (!this.authenticatedService.getIsLoggedIn()) {
            this.modalService.open(LoginPromptComponent);
        } else {
            this.enableEditor = true;
        }
        
    }

    cancelEditor() {
        this.trumbowygService.destroyEditor(`${TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR}-${this.commentData.data.id}`);
        this.enableEditor = false;
    }

    replyComment(id: string, kind: string) {
        const thingID = `${kind}_${id}`;
        const trumbowygSelector = `${TrumbowygConstants.TRUMBOWYG_COMMENT_EDITOR}-${this.commentData.data.id}`;

        const content = this.checkDeviceFeatureService.isTouchScreen ?
            this.commentEditor.commentContent : this.trumbowygService.getTrumbowygAsMarkdown(trumbowygSelector);

        const data = {
            thingID: thingID,
            content: content
        };
        this.redditSubmitService.comment(data).subscribe(data => {
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