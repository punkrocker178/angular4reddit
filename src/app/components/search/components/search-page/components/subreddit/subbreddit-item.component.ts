import { Component, Input } from '@angular/core';
 
@Component({
    selector: 'subreddit-item',
    templateUrl: './subreddit-item.component.html'
})

export class SubbredditItemComponent {

    icon: string;
    @Input() subredditData;

    constructor() {}

    ngOnInit() {
        this.icon = this.subredditData.data.community_icon || this.subredditData.data.icon_img;
        console.log(this.icon);
    }

    isUserSubscriber() {
        return this.subredditData.data.user_is_subscriber;
    }
  
}