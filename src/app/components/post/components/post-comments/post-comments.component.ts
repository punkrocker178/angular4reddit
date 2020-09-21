import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'post-comments',
    templateUrl: './post-comments.html'
  })
export class PostCommentsComponent {

  @Input() comments;
  moreComments;
  
  constructor(
    private listingService: RedditListingService
  ) {}
  
  ngOnInit() {
    this.moreComments = this.comments.pop();
    console.log(this.moreComments);
  }
}