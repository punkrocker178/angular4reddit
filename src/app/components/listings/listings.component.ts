import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { BehaviorSubject, of, combineLatest, Subject, timer } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { tap, switchMap, filter, takeUntil, catchError, finalize, debounceTime } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { Post } from 'src/app/model/post';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { QueryRequest } from 'src/app/model/query-request';
import { MAX_POST_LIMIT, QUERY_LIMIT } from 'src/app/constants/constants';

@Component({
  selector: 'app-listings-component',
  templateUrl: './listings.html'
})
export class ListingsComponent implements OnInit, OnDestroy {
  @Input() type: string;
  @Input() username: string;

  public subreddit: string;
  public flairFilter: string;

  public sort = ApiList.LISTINGS_HOT;
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject([]);
  public scroll$ = new BehaviorSubject(null);
  public scrollNextData$ = new BehaviorSubject(null);

  public destroy$ = new Subject();

  public beforeData: Post[] = [];
  public pagingStack: string[] = [];
  public after: string;
  public isLoading: boolean;
  public isError: boolean;
  public errorMsg = '';

  public isLoggedIn: boolean;

  constructor(
    private authenticateService: RedditAuthenticateService,
    private redditService: RedditListingService,
    private subredditService: SubredditService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this._subscribeQueryParamChanges();
    this._subscribeScrollDownChanges();

    this.isLoggedIn = this.authenticateService.getIsLoggedIn();
  }

  private _subscribeQueryParamChanges(): void {
    const queryParamMap = this.activatedRoute.queryParamMap;
    const paramMap = this.activatedRoute.paramMap;

    combineLatest([paramMap, queryParamMap]).pipe(
      takeUntil(this.destroy$),
      switchMap(([pathParam, queryParam]) => {
        this.after = null;

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

        this.scroll$.next(true);

        if (this.posts$.getValue().length > 0) {
          return this.fetchData(null, true)
        }

        return of([]);
      }
      )
    ).subscribe();
  }

  private _subscribeScrollDownChanges(): void {
    this.scroll$.pipe(
      debounceTime(500),
      takeUntil(this.destroy$),
      filter(event => event !== null && !this.isLoading),
      switchMap(_ => this.fetchData(this.after))
    ).subscribe(_ => {
    });
  }

  private fetchData(after?: string, refreshData?: boolean) {

    if (this.after == null && this.posts$.getValue().length > 0 && !refreshData) {
      return of([]);
    }

    if (refreshData) {
      this.posts$.next([]);
    }

    this.isLoading = true;
    let queryParams = {
      // limit: RedditListingService.QUERY_LIMIT
      limit: QUERY_LIMIT 
    } as QueryRequest;

    if (after) {
      queryParams.after = this.after
    }

    if (this.flairFilter) {
      const searchTerm = `flair_name:"${this.flairFilter}"`;
      return this.subredditService.searchInSubreddit(searchTerm, this.subreddit, this.after).pipe(
        tap(next => this.updateListingData(next)));
    }

    return this.redditService.getListigs(this.defaultListingsTypeApi(), queryParams).pipe(
      catchError(err => {
        this.isLoading = false;
        this.isError = true;
        this.errorMsg = `Code: ${err.status} -  Message: ${err.error.message}`;
        return err;
      }),
      tap(next => this.updateListingData(next))
    );
  }

  // Update listing, will remove old post if reaches limit
  private updateListingData(next) {
    this.pagingStack.push(this.after);
    this.after = next.after;
    let currentPosts = this.posts$.getValue();

    if (currentPosts.length >= MAX_POST_LIMIT) {
      this.beforeData.push(...currentPosts.slice(0, QUERY_LIMIT));
      currentPosts = currentPosts.slice(QUERY_LIMIT);
    }

    this.posts$.next([...currentPosts, ...next.children]);
    timer(100).subscribe(() => this.isLoading = false);
  }

  public changeSort(value) {
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
      case ApiList.LISTINGS_ALL:
        this.sort = ApiList.LISTINGS_ALL;
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

  private defaultListingsTypeApi() {
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

  private flushDataOnSubredditChange(pathParam) {
    // Flush stored data when subreddit changes
    const subredditChange = pathParam.has('subreddit') && pathParam.get('subreddit') !== this.redditService.visitedSubreddit;

    // Flush stored data when going back to home from a subreddit page
    const goToHome = !pathParam.has('subreddit') && this.redditService.visitedSubreddit;

    if (subredditChange || goToHome) {
      this.redditService.listingStoredData = null;
    }
  }

  private flushDataOnUserChange(pathParam) {
    const userChange = pathParam.has('user') && pathParam.get('user') !== this.redditService.visitedUser;
    const goToHome = !pathParam.has('user') && this.redditService.visitedUser;

    if (userChange || goToHome) {
      this.redditService.listingStoredData = null;
    }
  }

  private flushDataOnFlairChange(queryParam) {
    if (queryParam.has('flair')) {
      this.flairFilter = queryParam.get('flair');
      this.redditService.listingStoredData = null;
    } else {
      this.flairFilter = null;
    }
  }

  public loadMore(event) {
    this.scroll$.next(event);
  }

  public loadPrevious() {
    if (this.pagingStack.length <= MAX_POST_LIMIT / QUERY_LIMIT) {
      return;
    }

    let currentPost = this.posts$.getValue();
    const beforeToBePrepend = this.beforeData.splice(- QUERY_LIMIT, QUERY_LIMIT);

    const end = MAX_POST_LIMIT - QUERY_LIMIT;
    currentPost = currentPost.slice(0 , end);
    currentPost.unshift(...beforeToBePrepend);
    this.after = this.pagingStack.pop();

    this.posts$.next([...currentPost]);
  }

}
