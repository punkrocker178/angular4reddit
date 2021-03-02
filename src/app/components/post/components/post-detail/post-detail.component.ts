import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { TrumbowygConstants } from 'src/app/constants/trymbowyg-constants';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.html'
})
export class PostDetailComponent {

  isLoading: boolean = true;

  post: Post;
  comments;

  postId: string;

  disableCommentBtn = true;
  commentContent: string;

  constructor(
    private router: Router,
    private listingService: RedditListingService,
    private checkDeviceFeatureService: CheckDeviceFeatureService,
    private redditSubmitService: RedditSubmitService,
    private trumbowygService: TrumbowygService
  ) { }

  ngOnInit() {
    const apiSegment = this.router.url;
    this.listingService.getPostDetail(apiSegment)
      .pipe(
        tap((next) => {
          this.post = next.detail;
          this.comments = next.comments;
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  isArchived() {
    return this.post && this.post.data['archived'];
  }

  comment() {
    const thingID = `${this.post.kind}_${this.post.data['id']}`;
    const content = this.checkDeviceFeatureService.isTouchScreen ?
      this.commentContent : this.trumbowygService.getTrumbowygContent(TrumbowygConstants.TRUMBOWYG_EDITOR);
    const data = {
      thingID: thingID,
      content: content
    };

    this.redditSubmitService.comment(data).subscribe(data => {
      this.comments.push({
        data: data,
        kind: 't1'
      });
    });
  }

  useTrumbowygEditor() {
    return !this.checkDeviceFeatureService.isTouchScreen;
  }

  displayCommentButton(value: boolean) {
    this.disableCommentBtn = value;
  }

}