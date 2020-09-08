import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { ActivatedRoute, Router } from '@angular/router';
import { RedditListingService } from 'src/app/services/reddit-listing.service';

@Component({
    selector: 'post-detail',
    templateUrl: './post-detail.html'
  })
export class PostDetailComponent {
  
  constructor(
    private router: Router,
    private listingService: RedditListingService
  ) {}
  
  ngOnInit() {
    console.log('heelo');
    const apiSegment = this.router.url;
    console.log(apiSegment)
    this.listingService.getListigs(apiSegment, {limt: 25}).subscribe(data => console.log(data));
  }
}