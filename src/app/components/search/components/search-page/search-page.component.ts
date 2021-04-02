import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';
 
@Component({
    selector: 'app-search',
    templateUrl: './search-page.component.html'
})

export class SearchPageComponent {

    searchTerm: string;

    subreddit$: Observable<any>;
    subreddits = [];
    subredditAfter: string;
    submission$: Observable<any>;
    submissions;

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            this.searchTerm = params.get('term');
            this.searchSubreddits(this.searchTerm);
            this.searchSubmissions(this.searchTerm);
        });
        
    }

    searchSubreddits(name: string, after?: string, limit?: number) {
        const payload  = {
            name: name,
            limit: limit ? limit : 5,
            after: after
        };

        this.subreddit$ = this.redditSearchService.searchSubreddit(payload).pipe(
            tap((next:any) => {
                this.subreddits = [...this.subreddits, ...next.children];
                this.subredditAfter = next.after;
            })
        );
    }

    searchSubmissions(term: string) {
        const payload = {
            q: term,
            sort: 'desc',
            sort_type: 'score',
            size: 50,
            after: '30d'
        }
        this.submission$ = this.redditSearchService.searchSubmission(payload).pipe(
            tap(next => this.submissions = next)
        );
    }

    loadMoreSubreddits() {
        this.searchSubreddits(this.searchTerm, this.subredditAfter, 25);
    }

}