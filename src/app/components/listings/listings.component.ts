import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, BehaviorSubject, of, combineLatest, Subject, fromEvent } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { tap, switchMap, filter, throttleTime, takeUntil, catchError, debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { Post } from 'src/app/model/post';

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
  posts$: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  scroll$ = new BehaviorSubject(null);
  scrollNextData$ = new BehaviorSubject(null);

  destroy$ = new Subject();

  after: string;
  isLoading: boolean = true;
  isError: boolean;
  errorMsg = '';

  showScrollTopBtn: boolean;

  previousData = [];
  nextData = [];

  scrollYPosition = 0;

  constructor(
    private redditService: RedditListingService,
    private subredditService: SubredditService,
    private activatedRoute: ActivatedRoute,
    private checkDeviceFeatureService: CheckDeviceFeatureService) { }

  ngOnInit(): void {
    const queryParamOb = this.activatedRoute.queryParamMap;
    const paramOb = this.activatedRoute.paramMap;

    combineLatest([paramOb, queryParamOb]).pipe(
      takeUntil(this.destroy$),
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

    this.scroll$.pipe(
      takeUntil(this.destroy$),
      filter(event => event !== null),
      switchMap(_ => this.fetchData(this.after))
    ).subscribe(_ => {
      this.isLoading = false;
    });

    // Show hidden post when scroll up
    this.scrollNextData$.pipe(
      takeUntil(this.destroy$),
      filter(next => next !== null),
      throttleTime(2000),
      tap(_ => {
        let currentPosts = this.posts$.getValue();

        currentPosts.forEach((post, index) => {
          if (index < RedditListingService.QUERY_LIMIT) {
            this.previousData.push(post);
          }
        });

        currentPosts = currentPosts.slice(RedditListingService.QUERY_LIMIT);

        let nextPosts = [];

        for (let i = 0; i < this.nextData.length; i++) {
          nextPosts.push(this.nextData.pop());
        }

        currentPosts.push(...nextPosts);
        this.posts$.next(currentPosts);
      })
    ).subscribe();

    /* Auto hide scroll to top button */
    // fromEvent(document, 'scroll').pipe(
    //   takeUntil(this.destroy$),
    //   throttleTime(3000),
    //   debounceTime(1500),
    //   tap(event => {
    //     if (window.pageYOffset > this.scrollYPosition) {
    //       this.showScrollTopBtn = false;
    //     } else {
    //       this.showScrollTopBtn = true;
    //     }
    //     this.scrollYPosition = window.pageYOffset;
    //   })
    // ).subscribe();
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
      limit: RedditListingService.QUERY_LIMIT
    }

    if (after) {
      queryParams['after'] = this.after
    }

    const updateData = (next: any) => {
      this.after = next.after;
      let currentPosts = this.posts$.getValue();

      if (currentPosts.length >= RedditListingService.MAX_POST_LIMIT) {
        currentPosts = currentPosts.slice(RedditListingService.QUERY_LIMIT);
        this.previousData.push(...this.posts$.getValue().splice(0, RedditListingService.QUERY_LIMIT));
      }

      this.posts$.next([...currentPosts, ...next.children]);

    };

    if (this.flairFilter) {
      const searchTerm = `flair_name:"${this.flairFilter}"`;
      return this.subredditService.searchInSubreddit(searchTerm, this.subreddit, this.after).pipe(
        tap(updateData));
    }

    return this.redditService.getListigs(this.defaultListingsTypeApi(), queryParams).pipe(
      tap(updateData), catchError(err => {
        this.isLoading = false;
        this.isError = true;
        this.errorMsg = `Code: ${err.status} -  Message: ${err.error.message}`;
        console.log(err);
        return err;
      }
      ));

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
    this.destroy$.next(true);
    this.destroy$.complete();
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
    if (this.nextData.length === 0) {
      this.scroll$.next(event);
    } else {
      this.scrollNextData$.next(event);
    }

  }

  loadPrevious() {
    if (this.previousData.length === 0) {
      return;
    }

    const lastItemsIndex = -RedditListingService.QUERY_LIMIT;

    const currentPosts = this.posts$.getValue();
    currentPosts.unshift(...this.previousData.slice(lastItemsIndex));

    if (currentPosts.length >= RedditListingService.MAX_POST_LIMIT) {
      this.nextData.push(...currentPosts.slice(lastItemsIndex));
    }

    currentPosts.splice(lastItemsIndex);
    this.posts$.next(currentPosts);

    for (let i = 0; i < RedditListingService.QUERY_LIMIT; i++) {
      this.previousData.pop();
    }
  }

}
