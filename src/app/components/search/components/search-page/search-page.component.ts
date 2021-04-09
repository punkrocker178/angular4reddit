import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
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
    allSubredditResults = false;

    submission$ = new BehaviorSubject([]);
    submissionLoading = true;
    submissionBefore;

    allResults = false;

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.paramSubscription = this.activatedRoute.paramMap.subscribe(params => {
            this.searchTerm = params.get('term');
            this.searchSubreddits(this.searchTerm).subscribe();
            this.searchSubmissions(this.searchTerm, null, null, 50).subscribe();
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
                if (next.after) {
                    this.subredditAfter = next.after;
                } else {
                    this.allSubredditResults = true;
                }
                
                this.subredditLoading = false;
            })
        );
    }

    searchSubmissions(term: string, before?: number, after?, limit?: number) {
        const payload = {
            q: term,
            sort: 'desc',
            sort_type: 'score',
            size: limit? limit : 25,
        }
        
        if (after) {
            payload['after'] = after;
        }

        if (before) {
            payload['before'] = before;
        }
        
        if (!before && !after) {
            payload['after'] = '14d';
        }

        return this.redditSearchService.searchSubmission(payload).pipe(
            tap(next => {

                if (next.length === 0) {
                    this.allResults = true;
                }

                this.submissionLoading = false;
                const currentSubmissions = this.submission$.getValue();
                this.submission$.next([...currentSubmissions, ...next]);
                this.submissionBefore = this.getOldestSubmission(next);
            })
        );
    }

    loadMoreSubreddits() {
        this.subredditLoading = true;
        this.searchSubreddits(this.searchTerm, this.subredditAfter, 25).subscribe();
    }

    loadMoreSubmissions() {
        this.submissionLoading = true;
        this.searchSubmissions(this.searchTerm, this.submissionBefore, null, 50).subscribe();
    }

    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

    getOldestSubmission(submissions: []) {
        let oldestDate = Number.MAX_SAFE_INTEGER;
        submissions.forEach(submission => {
            if (oldestDate > submission['created_utc']) {
                oldestDate = submission['created_utc']
            }
        });
        return oldestDate;
    }

    getHotSubmission(date: string) {
        this.submissionLoading = true;
        this.submission$.next([]);
        this.searchSubmissions(this.searchTerm, null, date, 100).subscribe();
    }

}