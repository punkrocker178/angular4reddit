import { Component, Input } from '@angular/core';
import { tap } from 'rxjs/operators';
import { RedditSubmitService } from 'src/app/services/reddit-submit.service';
@Component({
    selector: 'post-comments',
    templateUrl: './post-comments.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
  })
export class PostCommentsComponent {

  @Input() comments;
  @Input() isReplies;

  moreComments;
  enableEditor: boolean;

  trumbowygConfigs = {
    isComment: true
  }
  
  constructor(private submitService: RedditSubmitService) {}
  
  ngOnInit() {
    if (typeof this.comments === 'object') {
      if (this.comments.data && this.comments.data['children']) {
        this.comments = this.comments.data['children'];  
      }
    }
  }

  /* Issue: ExpressionChangedAfterItHasBeenCheckedError */
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
    const payload = this.submitService.moreCommentsPayload(comment.data['name'], comment.data['children']);
    this.submitService.loadMoreComments(payload).pipe(
      tap(next => console.log(next))
    ).subscribe();
  }

}