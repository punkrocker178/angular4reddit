import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Post } from 'src/app/model/post';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';
import { CommentEditorComponent } from '../comment/components/comment-editor/comment-editor.component';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { PreferencesService } from 'src/app/services/preferences.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'post-detail',
  templateUrl: './post-detail.html'
})
export class PostDetailComponent implements OnInit {

  isLoading: boolean = true;

  post: Post;
  comments;
  postOptions;
  originalPoster: string;

  postId: string;

  defaultMarkdown: boolean;
  disableCommentBtn = true;

  @ViewChild(CommentEditorComponent) commentEditor;

  constructor(
    private router: Router,
    private authenticateService: RedditAuthenticateService,
    private listingService: RedditListingService,
    private checkDeviceFeatureService: CheckDeviceFeatureService,
    private redditSubmitService: RedditSubmitService,
    private trumbowygService: TrumbowygService,
    private preferenceService: PreferencesService
  ) { }

  ngOnInit() {
    const apiSegment = this.router.url;
    this.listingService.getPostDetail(apiSegment)
      .pipe(
        tap((next) => {
          this.post = next.detail;
          this.comments = next.comments;
          this.originalPoster = next.detail.data['author'];
          this.isLoading = false;

          this.postOptions = {
            isDetail: true,
            isArchive: this.post.data['archived']
          }
        })
      )
      .subscribe();

      this.defaultMarkdown = this.preferenceService.preferenceValue.useMarkdown;

  }

  comment() {
    const thingID = `${this.post.kind}_${this.post.data['id']}`;
    const content = !this.useTrumbowygEditor() ?
      this.commentEditor.commentContent: this.trumbowygService.getTrumbowygAsMarkdown(TrumbowygConstants.TRUMBOWYG_EDITOR);
    const data = {
      thingID: thingID,
      content: content
    };

    this.redditSubmitService.comment(data).subscribe(data => {

      if (this.commentEditor) {
        this.commentEditor.commentContent = '';
      }

      this.comments.push({
        data: data,
        kind: 't1'
      });
    });
  }

  useTrumbowygEditor() {
    return !this.checkDeviceFeatureService.isTouchScreen && !this.defaultMarkdown;
  }

  displayCommentButton(value: boolean) {
    this.disableCommentBtn = value;
  }

  showCommentEditor() {
    return this.authenticateService.getIsLoggedIn();
  }

}
