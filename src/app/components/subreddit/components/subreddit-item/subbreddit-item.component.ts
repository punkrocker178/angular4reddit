import { Component, OnInit, input } from '@angular/core';
import { Router } from '@angular/router';
import { SubredditAbout } from 'src/app/model/subreddit.interface';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html',
    standalone: false
})

export class SubbredditItemComponent implements OnInit {

    icon: string;
    readonly subredditData = input<SubredditAbout>(undefined);

    constructor(
        private router: Router,
        private checkDeviceFeatureService: CheckDeviceFeatureService) {}

    ngOnInit() {
        const subredditData = this.subredditData();
        this.icon = subredditData.data.community_icon || subredditData.data.icon_img;
    }

    navigateToSubreddit() {
        this.router.navigateByUrl(`/${this.subredditData().data.display_name_prefixed}`);
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }

}
