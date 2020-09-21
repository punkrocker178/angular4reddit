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
  
  constructor(
    private listingService: RedditListingService
  ) {}
  
  ngOnInit() {

  }
}