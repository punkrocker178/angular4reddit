import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';
 
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
    submission$: Observable<any>;
    submissions;

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.paramSubscription = this.activatedRoute.paramMap.subscribe(params => {
            this.searchTerm = params.get('term');
            this.searchSubreddits(this.searchTerm).subscribe();
            this.searchSubmissions(this.searchTerm);
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
        this.subredditLoading = true;
        this.searchSubreddits(this.searchTerm, this.subredditAfter, 25).subscribe();
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

}