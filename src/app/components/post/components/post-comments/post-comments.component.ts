import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'post-comments',
    templateUrl: './post-comments.html'
  })
export class PostCommentsComponent implements OnInit{

  @Input() comments;
  @Input() isReplies;
  @Input() postId: string;
  @Input() orginalPoster: string;
  @Input() isArchive: boolean;

  moreRepliesLoading: boolean;
  enableEditor: boolean;

  moreChildrenLimit = 0;
  moreChildrenId;

  @Input() useMarkdown: boolean;

  trumbowygConfigs = {
    isComment: true
  }

  constructor(
    private submitService: RedditSubmitService) {}

  ngOnInit() {
    if (typeof this.comments === 'object') {
      if (this.comments.data && this.comments.data['children']) {
        this.comments = this.comments.data['children'];
      }
    }
  }

  hasReplies(comment) {
    return comment.data['replies'] &&
    comment.data['replies']['data']['children'] &&
    comment.data['replies']['data']['children'].length > 0;
  }

  isComment(comment) {
    return comment.kind === 't1';
  }

  pushComment(comment) {
    this.comments.push(comment);
  }

  loadMoreReplies(event, comment) {
    event.preventDefault();

    if (this.moreRepliesLoading) {
      return;
    }

    this.moreRepliesLoading = true;
    this.moreChildrenId = comment.data['children'];

    let moreChildrenArray, end;

    if (this.moreChildrenId.length >= 100) {
      end = 100;
    } else {
      end = comment.data['children'].length;
    }

    moreChildrenArray = comment.data['children'].slice(0, end);

    const payload = this.submitService.moreCommentsPayload(this.postId, moreChildrenArray);
    this.submitService.loadMoreComments(payload).pipe(
      tap(next => {
        this.moreChildrenId.splice(0, end);
        this.comments = [...this.comments, ...next];
        this.moreRepliesLoading = false;
      })
    ).subscribe();
  }

}
