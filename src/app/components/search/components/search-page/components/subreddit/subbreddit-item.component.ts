import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';
 
@Component({
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html'
})

export class SubbredditItemComponent {

    icon: string;
    @Input() subredditData;

    constructor(private router: Router, private checkDeviceFeatureService: CheckDeviceFeatureService) {}

    ngOnInit() {
        this.icon = this.subredditData.data.community_icon || this.subredditData.data.icon_img;
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
  
}