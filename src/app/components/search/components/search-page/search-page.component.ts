import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';
 
@Component({
    selector: 'app-search',
    templateUrl: './search-page.component.html'
})

export class SearchPageComponent {

    subreddit$;
    subreddits;
    submission$;
    submissions;

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(params => {
            const term = params.get('term');
            this.searchSubreddits(term);
            this.searchSubmissions(term);
        });
        
    }

    searchSubreddits(name: string) {
        const limit = 5;
        this.subreddit$ = this.redditSearchService.searchSubreddit(name, limit).pipe(
            tap(next => this.subreddits = next)
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

}