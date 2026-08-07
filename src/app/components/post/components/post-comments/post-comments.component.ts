import { Component, effect, input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Post, PostReplies } from 'src/app/model/post';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'post-comments',
    templateUrl: './post-comments.html',
    standalone: false
})
export class PostCommentsComponent {

  readonly comments = input<Post[] | PostReplies>(undefined);
  readonly isReplies = input<boolean>(undefined);
  readonly postId = input<string>(undefined);
  readonly orginalPoster = input<string>(undefined);
  readonly isArchive = input<boolean>(undefined);

  commentList: Post[] = [];

  moreRepliesLoading: boolean;
  enableEditor: boolean;

  moreChildrenLimit = 0;
  moreChildrenId;

  readonly useMarkdown = input<boolean>(undefined);

  trumbowygConfigs = {
    isComment: true
  }

  constructor(
    private submitService: RedditSubmitService) {
      effect(() => {
        const comments = this.comments();
        if (Array.isArray(comments)) {
          this.commentList = comments;
        } else if (comments?.data?.children) {
          this.commentList = comments.data.children;
        }
      });
    }

  hasReplies(comment: Post): boolean {
    return comment.data['replies'] &&
    comment.data['replies']['data']['children'] &&
    comment.data['replies']['data']['children'].length > 0;
  }

  isComment(comment: Post): boolean {
    return comment.kind === 't1';
  }

  pushComment(comment: Post) {
    this.commentList.push(comment);
  }

  loadMoreReplies(event: Event, comment: Post) {
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

    const payload = this.submitService.moreCommentsPayload(this.postId(), moreChildrenArray);
    this.submitService.loadMoreComments(payload).pipe(
      tap(next => {
        this.moreChildrenId.splice(0, end);
        this.commentList = [...this.commentList, ...next];
        this.moreRepliesLoading = false;
      })
    ).subscribe();
  }

}
