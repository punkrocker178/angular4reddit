import { Component, OnInit, OnDestroy } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, from, merge, forkJoin, BehaviorSubject, Subscription, Subject, zip } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { Listings } from 'src/app/model/listings';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {

  listings: Observable<Listings>;
  posts$ = new BehaviorSubject([]);
  scroll$ = new BehaviorSubject(null);

  after: string;
  isLoading: boolean = true;

  title = 'Home';

  constructor(
    private redditService: RedditListingService,
    private authenService: RedditAuthenticateService) { }

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

    return this.redditService.getListigs(ApiList.LISTINGS_HOT, queryParams).pipe(
      map(data => {
        this.parseImgUrl(data.children);
        return data;
      }),
      tap(next => {
        this.after = next.after;
        const currentPosts = this.posts$.getValue();
        this.posts$.next([...currentPosts, ...next.children]);
      }
      ))

  }

  ngOnDestroy() {
  }

  parseImgUrl(children: any[]) {
    children.forEach(child => {
      if (child.data['preview']) {
        child.data['preview']['images'].forEach((image) => {
          image.source.url = image.source.url.replace(/(amp;)/g, '');
        })
      }
    })
  }

}
