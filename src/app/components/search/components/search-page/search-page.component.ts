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
    submission$;

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
        this.subreddit$ = this.redditSearchService.searchSubreddit(name);
    }

    searchSubmissions(term: string) {
        const payload = {
            q: term,
            sort: 'desc',
            size: 50,
            after: '30d'
        }
        this.submission$ = this.redditSearchService.searchSubmission(payload);
    }

}