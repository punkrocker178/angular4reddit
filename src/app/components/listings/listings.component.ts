import { Component, OnInit, OnDestroy, computed, signal, input } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { BehaviorSubject, of, combineLatest, Observable, Subject } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { tap, switchMap, filter, takeUntil, catchError, debounceTime, finalize } from 'rxjs/operators';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { Post } from 'src/app/model/post';
import { Listings } from 'src/app/model/listings.interface';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { QueryRequest } from 'src/app/model/query-request';
import { MAX_POST_LIMIT, QUERY_LIMIT } from 'src/app/constants/constants';

@Component({
    selector: 'app-listings-component',
    templateUrl: './listings.html',
    standalone: false
})
export class ListingsComponent implements OnInit, OnDestroy {
  readonly type = input<string>(undefined);
  readonly username = input<string>(undefined);

  private listingType = signal<string | undefined>(undefined);
  readonly effectiveType = computed(() => this.type() || this.listingType());
  
  public subreddit = signal('');
  public flairFilter = signal('');

  public isShowFeed = computed(() => {
    return this._authenticateService.getIsLoggedIn() && (!this.subreddit() || this.subreddit() === ApiList.LISTINGS_ALL_JSON)
  });

  public sort = ApiList.LISTINGS_HOT;
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public scroll$ = new BehaviorSubject<boolean>(false);
  public scrollNextData$ = new BehaviorSubject<Listings | null>(null);

  public destroy$ = new Subject<boolean>();

  public beforeData: Post[] = [];
  public pagingStack: string[] = [];
  public after: string | null;
  public isLoading: boolean;
  public isError: boolean;
  public errorMsg = '';

  constructor(
    private _authenticateService: RedditAuthenticateService,
    private _redditService: RedditListingService,
    private _subredditService: SubredditService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this._subscribeQueryParamChanges();
    this._subscribeScrollDownChanges();
    this.loadMore();
  }

  private _subscribeQueryParamChanges(): void {
    const queryParamMap = this._activatedRoute.queryParamMap;
    const paramMap = this._activatedRoute.paramMap;

    combineLatest([paramMap, queryParamMap]).pipe(
      takeUntil(this.destroy$),
      switchMap(([pathParam, queryParam]) => {
        this.after = null;
        this._flushDataOnSubredditChange(pathParam);

        this._flushDataOnUserChange(pathParam);

        this._flushDataOnFlairChange(queryParam);

        if (pathParam.has('subreddit')) {
          this.subreddit.set(pathParam.get('subreddit')!);
          this._redditService.visitedSubreddit = this.subreddit();
        } else {
          this._redditService.visitedSubreddit = null;
        }

        if (pathParam.has('user')) {
          this._redditService.visitedUser = pathParam.get('user');
        } else {
          this._redditService.visitedUser = null;
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
      debounceTime(10),
      takeUntil(this.destroy$),
      filter(event => event !== null && !this.isLoading),
      switchMap(_ => this.fetchData(this.after))
    ).subscribe(_ => {
    });
  }

  private fetchData(after?: string | null, refreshData?: boolean): Observable<Listings | Post[]> {

    if (this.after == null && this.posts$.getValue().length > 0 && !refreshData) {
      return of([] as Post[]);
    }

    if (refreshData) {
      this.posts$.next([]);
    }

    this.isLoading = true;
    let queryParams = {
      limit: QUERY_LIMIT,
    } as QueryRequest;

    if (after) {
      queryParams.after = this.after
    }

    if (this.flairFilter()) {
      const searchTerm = `flair_name:"${this.flairFilter()}"`;
      return this._subredditService.searchInSubreddit(searchTerm, this.subreddit(), this.after).pipe(
        tap(next => this._updateListingData(next)),
        finalize(() => this.isLoading = false)
      );
    }

    return this._redditService.getListigs(this._defaultListingsTypeApi(), queryParams).pipe(
      catchError(err => {
        this.isError = true;
        this.errorMsg = `Code: ${err.status} -  Message: ${err.error.message}`;
        return of({ kind: '', after: '', children: [] } as Listings);
      }),
      tap((next: Listings) => this._updateListingData(next)),
      finalize(() => this.isLoading = false)
    );
  }

  // Update listing, will remove old post if reaches limit
  private _updateListingData(next: Listings): void {
    if (this.after) {
      this.pagingStack.push(this.after);
    }
    this.after = next.after;
    let currentPosts = this.posts$.getValue();

    if (currentPosts.length >= MAX_POST_LIMIT) {
      this.beforeData.push(...currentPosts.slice(0, QUERY_LIMIT));
      currentPosts = currentPosts.slice(QUERY_LIMIT);
    }

    this.posts$.next([...currentPosts, ...next.children]);
  }

  public changeSort(value: string): void {
    this.subreddit.set('');
    this.listingType.set('');

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
        this.listingType.set('subreddit');
        this.subreddit.set(ApiList.LISTINGS_ALL_JSON);
        this.sort = '';
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

  private _defaultListingsTypeApi(): string {
    let apiSegment = '';
    switch (this.effectiveType()) {
      case 'user-profile':
        apiSegment = `/user/${this.username()}/overview${this.sort}`;
        break;
      case 'subreddit':
        apiSegment = `/r/${this.subreddit()}${this.sort}`;
        break;
      default:
        apiSegment = this.sort;
        break;
    }
    return apiSegment;
  }

  private _flushDataOnSubredditChange(pathParam: ParamMap): void {
    // Flush stored data when subreddit changes
    const subredditChange = pathParam.has('subreddit') && pathParam.get('subreddit') !== this._redditService.visitedSubreddit;

    // Flush stored data when going back to home from a subreddit page
    const goToHome = !pathParam.has('subreddit') && this._redditService.visitedSubreddit;

    if (subredditChange || goToHome) {
      this._redditService.listingStoredData = null;
    }
  }

  private _flushDataOnUserChange(pathParam: ParamMap): void {
    const userChange = pathParam.has('user') && pathParam.get('user') !== this._redditService.visitedUser;
    const goToHome = !pathParam.has('user') && this._redditService.visitedUser;

    if (userChange || goToHome) {
      this._redditService.listingStoredData = null;
    }
  }

  private _flushDataOnFlairChange(queryParam: ParamMap): void {
    if (queryParam.has('flair')) {
      this.flairFilter.set(queryParam.get('flair'));
      this._redditService.listingStoredData = null;
    } else {
      this.flairFilter.set('');
    }
  }

  public loadMore(_event?: Event): void {
    this.scroll$.next(true);
  }

  public loadPrevious() {
    if (this.pagingStack.length <= MAX_POST_LIMIT / QUERY_LIMIT) {
      return;
    }

    let currentPost = this.posts$.getValue();
    const beforeToBePrepend = this.beforeData.splice(- QUERY_LIMIT, QUERY_LIMIT);

    const end = MAX_POST_LIMIT - QUERY_LIMIT;
    currentPost = currentPost.slice(0, end);
    currentPost.unshift(...beforeToBePrepend);
    this.after = this.pagingStack.pop() ?? null;

    this.posts$.next([...currentPost]);
  }

}
