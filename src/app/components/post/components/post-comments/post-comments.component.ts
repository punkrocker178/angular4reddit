import { Component, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Post, PostReplies } from 'src/app/model/post';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'post-comments',
    templateUrl: './post-comments.html'
  })
export class PostCommentsComponent implements OnInit{

  @Input() comments: Post[] | PostReplies;
  @Input() isReplies: boolean;
  @Input() postId: string;
  @Input() orginalPoster: string;
  @Input() isArchive: boolean;

  commentList: Post[] = [];

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
    if (Array.isArray(this.comments)) {
      this.commentList = this.comments;
    } else if (this.comments?.data?.children) {
      this.commentList = this.comments.data.children;
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

  pushComment(comment: Post) {
    this.commentList.push(comment);
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
        this.commentList = [...this.commentList, ...next];
        this.moreRepliesLoading = false;
      })
    ).subscribe();
  }

}
