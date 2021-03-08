import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
 
@Component({
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html'
})

export class SubbredditItemComponent {

    icon: string;
    @Input() subredditData;

    constructor(private router: Router) {}

    ngOnInit() {
        this.icon = this.subredditData.data.community_icon || this.subredditData.data.icon_img;
    }

    isUserSubscriber() {
        return this.subredditData.data.user_is_subscriber;
    }

    navigateToSubreddit() {
        this.router.navigateByUrl(`/${this.subredditData.data.display_name_prefixed}`);
    }
  
}