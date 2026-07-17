import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SubredditAbout } from 'src/app/model/subreddit.interface';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html'
})

export class SubbredditItemComponent implements OnInit {

    icon: string;
    @Input() subredditData: SubredditAbout;

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

}
