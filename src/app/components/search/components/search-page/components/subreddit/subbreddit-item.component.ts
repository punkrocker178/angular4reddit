import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
import { SubredditService } from 'src/app/services/subreddit.service';
 
@Component({
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html'
})

export class SubbredditItemComponent {

    icon: string;
    @Input() subredditData;
    subscribe$ = new Subject();

    constructor(
        private router: Router,
        private checkDeviceFeatureService: CheckDeviceFeatureService,
        private subredditService: SubredditService) {}

    ngOnInit() {
        this.icon = this.subredditData.data.community_icon || this.subredditData.data.icon_img;
        this.subscribe$.pipe(
            switchMap((action:string) => this.subredditService.subscribeSubreddit(action, this.subredditData.data.name)),
            tap(next => {
                console.log(next);
                this.subredditData.data.user_is_subscriber = !this.subredditData.data.user_is_subscriber; 
            })
        ).subscribe();
    }

    isUserSubscriber() {
        return this.subredditData.data.user_is_subscriber;
    }

    navigateToSubreddit() {
        this.router.navigateByUrl(`/${this.subredditData.data.display_name_prefixed}`);
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }

    subscribe() {
        const action = this.isUserSubscriber() ? 'unsub' : 'sub';
        this.subscribe$.next(action);
    }

    ngOnDestroy() {
        this.subscribe$.complete();
        this.subscribe$.unsubscribe();
    }
  
}