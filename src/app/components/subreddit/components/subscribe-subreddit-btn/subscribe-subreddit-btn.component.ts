import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SubredditService } from 'src/app/services/subreddit.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'subsribe-subreddit-btn',
    templateUrl: './subscribe-subreddit-btn.component.html'
})

export class SubscribeSubredditBtnComponent implements OnInit, OnDestroy {

    @Input() subredditData;
    isSubscribed: boolean;
    subscribe$ = new Subject();

    constructor(
        private subredditService: SubredditService) {}

    ngOnInit() {
        this.isSubscribed = this.subredditData.user_is_subscriber;
        this.subscribe$.pipe(
            switchMap((action:string) => this.subredditService.subscribeSubreddit(action, this.subredditData.name)),
            tap(_ => {
                this.isSubscribed = !this.isSubscribed;
            })
        ).subscribe();
    }

    subscribe() {
        const action = this.isSubscribed ? 'unsub' : 'sub';
        this.subscribe$.next(action);
    }

    ngOnDestroy() {
        this.subscribe$.complete();
        this.subscribe$.unsubscribe();
    }

}
