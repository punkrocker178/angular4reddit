import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';
import { DateTime } from 'luxon';
 
@Component({
    selector: 'app-search',
    templateUrl: './search-page.component.html'
})

export class SearchPageComponent {

    searchTerm: string;

    paramSubscription: Subscription;

    subreddit$ = new BehaviorSubject([]);
    subredditLoading = true;
    subredditAfter: string;

    submission$ = new BehaviorSubject([]);
    submissionLoading = true;
    submissionBefore;

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.paramSubscription = this.activatedRoute.paramMap.subscribe(params => {
            this.searchTerm = params.get('term');
            this.searchSubreddits(this.searchTerm).subscribe();
            this.searchSubmissions(this.searchTerm).subscribe();
        });
        
    }

    searchSubreddits(name: string, after?: string, limit?: number) {
        const payload  = {
            name: name,
            limit: limit ? limit : 5,
            after: after
        };

        return this.redditSearchService.searchSubreddit(payload).pipe(
            tap((next:any) => {
                const currentSubreddits = this.subreddit$.getValue();
                this.subreddit$.next([...currentSubreddits, ...next.children]);
                this.subredditAfter = next.after;
                this.subredditLoading = false;
            })
        );
    }

    searchSubmissions(term: string, before?: number, limit?: number) {
        const payload = {
            q: term,
            sort: 'desc',
            sort_type: 'created_utc',
            size: limit? limit : 25,
        }
        
        if (before) {
            payload['before'] = before;
        }

        return this.redditSearchService.searchSubmission(payload).pipe(
            tap(next => {
                this.submissionLoading = false;
                const currentSubmissions = this.submission$.getValue();
                this.submission$.next([...currentSubmissions, ...next]);
                this.submissionBefore = next[next.length - 1]['created_utc'];
            })
        );
    }

    loadMoreSubreddits() {
        this.subredditLoading = true;
        this.searchSubreddits(this.searchTerm, this.subredditAfter, 25).subscribe();
    }

    loadMoreSubmissions() {
        this.submissionLoading = true;
        this.searchSubmissions(this.searchTerm, this.submissionBefore, 25).subscribe();
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

}