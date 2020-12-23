import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { Listings } from 'src/app/model/listings';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'listings-component',
  templateUrl: './listings.html'
})
export class ListingsComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() username: string;
  @Input() subreddit: string;

  sort = ApiList.LISTINGS_HOT;
  posts$ = new BehaviorSubject([]);
  scroll$ = new BehaviorSubject(null);

  after: string;
  isLoading: boolean = true;

  constructor(
    private redditService: RedditListingService) { }

  ngOnInit(): void {
    this.scroll$.pipe(
      debounceTime(1000),
      switchMap(_ => this.fetchData(this.after))
    ).subscribe(_ => {
      this.isLoading = false;
    });
  }

  fetchData(after?: string) {
    this.isLoading = true;
    let queryParams = {
      limit: 25
    }

    if (after) {
      queryParams['after'] = this.after
    }

    return this.redditService.getListigs(this.defaultListingsTypeApi(), queryParams).pipe(
      tap(next => {
        this.after = next.after;
        const currentPosts = this.posts$.getValue();
        this.posts$.next([...currentPosts, ...next.children]);
      }
      ))

  }

  changeSort(value) {
    switch (value) {
      case ApiList.LISTINGS_HOT_LABEL:
        this.sort = ApiList.LISTINGS_HOT;
        break;
      case ApiList.LISTINGS_BEST_LABEL:
        this.sort = ApiList.LISTINGS_BEST;
        break;
      case ApiList.LISTINGS_RISING_LABEL:
        this.sort = ApiList.LISTINGS_RISING;
        break;
      case ApiList.LISTINGS_NEW_LABEL:
        this.sort = ApiList.LISTINGS_NEW;
        break;
    }
    this.posts$.next([]);
    this.fetchData().subscribe(_ => this.isLoading = false);
  }

  ngOnDestroy() {
  }

  defaultListingsTypeApi() {
    let apiSegment = '';
    switch (this.type) {
      case 'user-profile':
        apiSegment = '/user/' + this.username + '/overview' + ApiList.LISTINGS_HOT;
        break;
      case 'subreddit':
        apiSegment = '/r/' + this.subreddit + ApiList.LISTINGS_HOT;
        break;
      default:
        apiSegment = this.sort;
        break;
    }
    return apiSegment;
  }

}
