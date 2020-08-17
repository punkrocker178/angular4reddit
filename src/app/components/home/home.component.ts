import { Component, OnInit } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, from, merge, forkJoin, BehaviorSubject, Subscription, Subject, zip } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { Listings } from 'src/app/model/listings';
import { pluck, map, takeUntil, tap, mergeMap, scan } from 'rxjs/operators';
import { Post } from 'src/app/model/post';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  listings: Observable<Listings>;
  posts: Promise<Post[]>;
  after: string;
  subject: Subject<boolean> = new Subject();

  title = 'Home';
  private user: any;

  constructor(private redditService: RedditListingService, private authenService: RedditAuthenticateService) { }

  ngOnInit(): void {
    this.listings = this.redditService.getListigs(ApiList.LISTINGS_HOT, { limit: 30 }).pipe(
      tap(next => {
        this.after = next.after;
      }
      ));

    this.posts = this.listings.pipe(map(res => res.children)).toPromise();

  }

  loadMore() {
    this.listings = this.redditService.getListigs(ApiList.LISTINGS_HOT, { limit: 30, after: this.after }).pipe(
      tap(next => {
        this.after = next.after;
      }));

    this.posts = zip(
      from(this.posts),
      this.listings.pipe(pluck('children'))
    ).pipe(
      map(posts => posts[0].concat(posts[1]))
      ).toPromise()
  }


}
