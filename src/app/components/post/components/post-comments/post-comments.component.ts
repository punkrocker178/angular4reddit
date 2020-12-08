import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { VotingService } from 'src/app/services/vote.service';

@Component({
    selector: 'post-comments',
    templateUrl: './post-comments.html',
    // changeDetection: ChangeDetectionStrategy.OnPush
  })
export class PostCommentsComponent {

  @Input() comments;
  @Input() isReplies;

  moreComments;
  
  constructor(
    private listingService: RedditListingService,
    private votingService: VotingService
  ) {}
  
  ngOnInit() {
    if (typeof this.comments === 'object') {
      if (this.comments.data && this.comments.data['children']) {
        this.comments = this.comments.data['children'];  
      }
    }

    // this.moreComments = this.comments.pop();
  }

  /* Issue: ExpressionChangedAfterItHasBeenCheckedError */
  hasReplies(comment) {
    return comment.data['replies'] && 
    comment.data['replies']['data']['children'] && 
    comment.data['replies']['data']['children'].length > 0;
  }

  vote(direction) {

  }
}