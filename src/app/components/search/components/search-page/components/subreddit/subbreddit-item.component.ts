import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
 
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
        private checkDeviceFeatureService: CheckDeviceFeatureService) {}

    ngOnInit() {
        this.icon = this.subredditData.data.community_icon || this.subredditData.data.icon_img;
    }

    navigateToSubreddit() {
        this.router.navigateByUrl(`/${this.subredditData.data.display_name_prefixed}`);
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }

    ngOnDestroy() {
        this.subscribe$.complete();
        this.subscribe$.unsubscribe();
    }
  
}