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

  listings: Observable<Listings>;
  posts$ = new BehaviorSubject([]);
  scroll$ = new BehaviorSubject(null);

  after: string;
  isLoading: boolean = true;

  title = 'Home';

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

  ngOnDestroy() {
  }

  defaultListingsTypeApi() {
    let apiSegment = '';
    switch (this.type) {
      case 'user-profile':
        apiSegment = '/user/' + this.username +  '/overview' + ApiList.LISTINGS_HOT;
        break;
      case 'subreddit':
        apiSegment = '/r/' + this.subreddit + ApiList.LISTINGS_HOT;
        break;
      default:
        apiSegment = ApiList.LISTINGS_NEW;
        break;
    }
    return apiSegment;
  }
  
}
