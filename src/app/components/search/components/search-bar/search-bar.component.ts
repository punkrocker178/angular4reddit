import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html'
})

export class SearchBarComponent implements OnInit {

    constructor(private redditSearchService: RedditSearchService,
        private router: Router) {}

    model;

    search = (text$: Observable<String>) => {
        return text$.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term: string) => {
            if (term.length < 2) {
                return of([]);
            }
            return this.redditSearchService.searchSubreddit(term);
        }), catchError(error => {
            console.error(error);
            return of([]);
        }));
    }

    navigateToSubreddit(item) {
        const subreddit = item.item;
        this.router.navigateByUrl(`/r/${subreddit}`);
    }

    ngOnInit() {

    }

}