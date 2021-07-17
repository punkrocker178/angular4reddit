import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, BehaviorSubject, Subscription, of, combineLatest } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { tap, switchMap, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
  selector: 'listings-component',
  templateUrl: './listings.html'
})
export class ListingsComponent implements OnInit, OnDestroy {

  @Input() type: string;
  @Input() username: string;
  subreddit: string;
  flairFilter: string;

  sort = ApiList.LISTINGS_HOT;
  posts$ = new BehaviorSubject([]);
  scroll$ = new BehaviorSubject(null);

  scrollSubscription: Subscription;
  paramSubscription: Subscription;
  queryParamSubscription: Subscription;

  after: string;
  isLoading: boolean = true;

  constructor(
    private redditService: RedditListingService,
    private subredditService: SubredditService,
    private activatedRoute: ActivatedRoute,
    private checkDeviceFeatureService: CheckDeviceFeatureService) { }

  ngOnInit(): void {
    const queryParamOb = this.activatedRoute.queryParamMap;
    const paramOb = this.activatedRoute.paramMap;

    combineLatest([paramOb, queryParamOb]).pipe(
      switchMap(value => {
        this.after = null;
        const pathParam = value[0];
        const queryParam = value[1];

        this.flushDataOnSubredditChange(pathParam);

        this.flushDataOnUserChange(pathParam);

        this.flushDataOnFlairChange(queryParam);

        if (pathParam.has('subreddit')) {
          this.subreddit = pathParam.get('subreddit');
          this.redditService.visitedSubreddit = this.subreddit;
        } else {
          this.redditService.visitedSubreddit = null;
        }

        if (pathParam.has('user')) {
          this.redditService.visitedUser = pathParam.get('user');
        } else {
          this.redditService.visitedUser = null;
        }

        if (this.redditService.listingStoredData) {
          const storedData = this.redditService.listingStoredData;
          this.after = storedData.after;
          this.posts$.next(storedData.children);
          return of([]);
        } else {
          this.scroll$.next(true);
        }

        if (this.posts$.getValue().length > 0) {
          return this.fetchData(null, true)
        }

        return of([]);
      }
      )
    ).subscribe();

    this.scrollSubscription = this.scroll$.pipe(
      filter(event => event !== null),
      switchMap(_ => this.fetchData(this.after))
    ).subscribe(_ => {
      this.isLoading = false;
    });
  }

  fetchData(after?: string, refreshData?: boolean) {

    if (this.after == null && this.posts$.getValue().length > 0 && !refreshData) {
      return of([]);
    }

    if (refreshData) {
      this.posts$.next([]);
    }

    this.isLoading = true;
    let queryParams = {
      limit: 20
    }

    if (this.checkDeviceFeatureService.isMobile()) {
      queryParams.limit = 15;
    }

    if (after) {
      queryParams['after'] = this.after
    }

    const updateData = (next: any) => {
      this.after = next.after;
      let currentPosts = this.posts$.getValue();

      if (currentPosts.length >= RedditListingService.MAX_POST_LIMIT) {
        currentPosts = currentPosts.slice(20);
      } 
      
      this.posts$.next([...currentPosts, ...next.children]);
    };

    if (this.flairFilter) {
      const searchTerm = `flair_name:"${this.flairFilter}"`;
      return this.subredditService.searchInSubreddit(searchTerm, this.subreddit, this.after).pipe(
        tap(updateData));
    }

    return this.redditService.getListigs(this.defaultListingsTypeApi(), queryParams).pipe(
      tap(updateData));

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
    this.after = null;
    this.fetchData().subscribe(_ => this.isLoading = false);
  }

  ngOnDestroy() {
    this.scrollSubscription.unsubscribe();
  }

  defaultListingsTypeApi() {
    let apiSegment = '';
    switch (this.type) {
      case 'user-profile':
        apiSegment = `/user/${this.username}/overview${this.sort}`;
        break;
      case 'subreddit':
        apiSegment = `/r/${this.subreddit}${this.sort}`;
        break;
      default:
        apiSegment = this.sort;
        break;
    }
    return apiSegment;
  }

  flushDataOnSubredditChange(pathParam) {
    // Flush stored data when subreddit changes
    const subredditChange = pathParam.has('subreddit') && pathParam.get('subreddit') !== this.redditService.visitedSubreddit;

    // Flush stored data when going back to home from a subreddit page
    const goToHome = !pathParam.has('subreddit') && this.redditService.visitedSubreddit;

    if (subredditChange || goToHome) {
      this.redditService.listingStoredData = null;
    }
  }

  flushDataOnUserChange(pathParam) {
    const userChange = pathParam.has('user') && pathParam.get('user') !== this.redditService.visitedUser;
    const goToHome = !pathParam.has('user') && this.redditService.visitedUser;
    
    if (userChange || goToHome) {
      this.redditService.listingStoredData = null;
    }
  }

  flushDataOnFlairChange(queryParam) {
    if (queryParam.has('flair')) {
      this.flairFilter = queryParam.get('flair');
      this.redditService.listingStoredData = null;
    } else {
      this.flairFilter = null;
    }
  }

  loadMore(event) {
    this.scroll$.next(event);
  }

}
