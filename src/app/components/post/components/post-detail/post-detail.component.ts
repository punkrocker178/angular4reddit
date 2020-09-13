import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'post-detail',
    templateUrl: './post-detail.html'
  })
export class PostDetailComponent {

  isLoading: boolean = true;

  post: Post;
  comments: Post;
  
  constructor(
    private router: Router,
    private listingService: RedditListingService
  ) {}
  
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
}