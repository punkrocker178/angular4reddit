import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';
import { TrumbowygService } from 'src/app/services/trumbowyg.service';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
  selector: 'post-detail',
  templateUrl: './post-detail.html'
})
export class PostDetailComponent {

  isLoading: boolean = true;

  post: Post;
  comments;

  postId: string;

  commentContent: string;

  constructor(
    private router: Router,
    private listingService: RedditListingService,
    private checkDeviceFeatureService: CheckDeviceFeatureService,
    private redditSubmitService: RedditSubmitService
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
    const content  = {
      thingID: thingID,
      content: this.commentContent ? this.commentContent : null
  };

    this.redditSubmitService.comment(content).subscribe(data => {
      this.comments.push({
        data: data,
        kind: 't1'
      });
    });
  }

  useTrumbowygEditor() {
    return !this.checkDeviceFeatureService.isTouchScreen;
  }

}