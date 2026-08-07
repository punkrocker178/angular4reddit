import { Component, computed, input } from '@angular/core';
import { Router } from '@angular/router';
import { SubredditAbout } from 'src/app/model/subreddit.interface';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html',
    standalone: false
})

export class SubbredditItemComponent {

    readonly subredditData = input<SubredditAbout>(undefined);

    readonly icon = computed(() => {
        const data = this.subredditData();
        return data?.data.community_icon || data?.data.icon_img;
    });

    constructor(
        private router: Router,
        private checkDeviceFeatureService: CheckDeviceFeatureService) {}

    navigateToSubreddit() {
        this.router.navigateByUrl(`/${this.subredditData().data.display_name_prefixed}`);
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }

}
