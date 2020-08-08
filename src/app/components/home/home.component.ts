import { Component, OnInit } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, from, merge, forkJoin } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { Listings } from 'src/app/model/listings';
import { pluck, map } from 'rxjs/operators';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  listings: Observable<Listings>;
  posts: Observable<Post[]>;

  title = 'Home';
  private user: any;

  constructor(private redditService: RedditListingService, private authenService: RedditAuthenticateService) { }

  ngOnInit(): void {
    this.listings = this.redditService.getListigs(ApiList.LISTINGS_HOT, { limit: 25 });
    this.posts = from(this.listings.pipe(pluck('children')));
    console.log(this.posts);
  }

  loadMore() {
    this.listings.subscribe(model => {

      let newPosts = from(this.redditService.getListigs(ApiList.LISTINGS_HOT,
        {
          limit: 25,
          after: model.after
        }).pipe(pluck('children')));
  
        forkJoin(this.posts, newPosts).pipe(
          map(
            ([posts, newPosts]) => [...posts, ...newPosts]
            )
          )
          .subscribe(data => {
          console.log(data);
        });
    });
    
  }

}
