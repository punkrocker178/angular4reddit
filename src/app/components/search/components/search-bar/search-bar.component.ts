import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable, of, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { RedditSearchService } from 'src/app/services/reddit-search.service';

@Component({
    selector: 'search-bar',
    templateUrl: './search-bar.component.html'
})

export class SearchBarComponent {

    constructor(private redditSearchService: RedditSearchService,
        private router: Router) { }

    model;

    keyEventSubscription: Subscription;
    @ViewChild('inputEl') inputElement: ElementRef;

    ngAfterViewInit() {
        const keyEvent = fromEvent(this.inputElement.nativeElement, 'keydown');
        this.keyEventSubscription = keyEvent.pipe(tap((event: any) => {
            if (event.keyCode === 13) {
                this.navigateToSearchComponent();
            }
        })).subscribe();
    }

    search = (text$: Observable<String>) => {
        return text$.pipe(debounceTime(300), distinctUntilChanged(), switchMap((term: string) => {
            if (term.length < 2) {
                return of([]);
            }
            return this.redditSearchService.searchSubredditNames(term);
        }), catchError(error => {
            console.error(error);
            return of([]);
        }));
    }

    navigateToSubreddit(item) {
        const subreddit = item.item;
        this.router.navigateByUrl(`/r/${subreddit}`);
    }

    navigateToSearchComponent() {
        if (this.model) {
            const path = `/search/${this.model}`;
            this.router.navigateByUrl(path);
        }
    }

    resultFormatter = (result: string) => {
        return `/r/${result}`;
    }

    ngOnDestroy() {
        this.keyEventSubscription && this.keyEventSubscription.unsubscribe();
    }
}