import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';

@Component({
    selector: 'app-search',
    templateUrl: './search-page.component.html'
})

export class SearchPageComponent implements OnInit, OnDestroy {

    searchTerm: string;

    paramSubscription: Subscription;

    subreddit$ = new BehaviorSubject([]);
    subredditLoading = true;
    subredditAfter: string;
    allSubredditResults = false;

    submission$ = new BehaviorSubject(null);
    submissionLoading = true;
    oldestSubmission;

    allResults = false;

    subredditFilter: string;
    timeOffset: string;
    resultsLimit;
    advancedSearchChanged: boolean;

    popoverConfig = {
        placement: 'bottom',
        modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
    }

    constructor(private redditSearchService: RedditSearchService,
        private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.paramSubscription = this.activatedRoute.paramMap.subscribe(params => {
            this.searchTerm = params.get('term');
            this.searchSubreddits(this.searchTerm).subscribe();
            /* Disabled because pushshift now requires Moderators access */
            /* https://www.reddit.com/r/pushshift/comments/14ei799/pushshift_live_again_and_how_moderators_can/ */
            // this.searchSubmissions(this.getSearchSubmissionPayload(this.searchTerm, null, null, null, this.getResultsLimit())).subscribe();
        });

    }

    getResultsLimit() {
        if (this.resultsLimit) {
            return parseInt(this.resultsLimit);
        }

        return 25;
    }

    getSearchSubmissionPayload(term: string, subreddit?: string, before?, after?, limit?: number) {
        return  {
            term: term,
            subredditFilter: subreddit,
            before: before ? before: undefined,
            after: after ? after : undefined,
            limit: limit ? limit : undefined
        }
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

    searchSubmissions(searchPayload: any) {
        const payload = {
            q: searchPayload.term,
            sort: 'desc',
            sort_type: 'score',
            size: searchPayload.limit? searchPayload.limit : 25,
        }

        if (searchPayload.subredditFilter) {
            payload['subreddit'] = searchPayload.subredditFilter;
        }

        if (searchPayload.after) {
            payload['after'] = searchPayload.after;
        }

        if (searchPayload.before) {
            payload['before'] = searchPayload.before;
        }

        if (!searchPayload.before && !searchPayload.after) {
            payload['after'] = '14d';
        }

        return this.redditSearchService.searchSubmission(payload).pipe(
            tap(next => {

                if (next.length === 0) {
                    this.allResults = true;
                }

                this.advancedSearchChanged = false;
                this.submissionLoading = false;
                const currentSubmissions = this.submission$.getValue();
                this.submission$.next([...currentSubmissions, ...next]);
                this.oldestSubmission = this.getOldestSubmission(next);
            })
        );
    }

    loadMoreSubreddits() {
        this.subredditLoading = true;
        this.searchSubreddits(this.searchTerm, this.subredditAfter, 25).subscribe();
    }

    loadMoreSubmissions() {
        this.submissionLoading = true;
        let after;
        switch(this.timeOffset) {
            case '1 Month':
                after = this.oldestSubmission - 2628000;
                break;
            case '1 Year':
                after = this.oldestSubmission - 31536000;
                break;
            case '1 Day' :
            default:
                after = this.oldestSubmission - 86400;
                break;
        }

        if (after < 0) {
            after = 0;
        }

        const searchPayload = this.getSearchSubmissionPayload(this.searchTerm, this.subredditFilter, this.oldestSubmission, after, this.getResultsLimit());

        this.searchSubmissions(searchPayload).subscribe();
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



    ngOnDestroy() {
        this.paramSubscription.unsubscribe();
    }

    getHotSubmission(date: string) {
        this.submissionLoading = true;
        this.submission$.next([]);
        this.allResults = false;

        const searchPayload = this.getSearchSubmissionPayload(this.searchTerm, null, null, date, 50);
        this.searchSubmissions(searchPayload).subscribe();
    }

    changeAdvanceSearch() {
        this.advancedSearchChanged = true;
    }

}
