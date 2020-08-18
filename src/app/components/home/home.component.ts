import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class HomeComponent implements OnInit, OnDestroy {

  listings: Observable<Listings>;
  posts: Post[] = [];
  posts$: Observable<Post[]>;
  listingsSubject: BehaviorSubject<Listings> = new BehaviorSubject<Listings>(null);

  after: string;
  isLoading: boolean = true;

  title = 'Home';
  private user: any;

  constructor(private redditService: RedditListingService, private authenService: RedditAuthenticateService) { }

  ngOnInit(): void {
    this.fetchData();
    this.posts$ = this.listingsSubject.pipe(
      map(res => {
        this.posts = [...this.posts, ...res.children];
        return this.posts;
      })
    );

  }

  loadMore() {
    this.fetchData(this.after);
  }

  fetchData(after?: string) {
    let queryParams = {
      limit: 30
    }

    if (after) {
      queryParams['after'] = this.after
    }

    this.redditService.getListigs(ApiList.LISTINGS_HOT, queryParams).pipe(
      tap(next => {
        this.after = next.after;
        this.listingsSubject.next(next);
      },
        takeUntil(this.listingsSubject)
      )).subscribe(_ => this.isLoading = false);

  }

  ngOnDestroy() {
    this.listingsSubject.next(null);
    this.listingsSubject.unsubscribe();
  }


}
