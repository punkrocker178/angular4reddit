import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'subreddit',
    templateUrl: './subreddit.component.html'
})

export class SubredditComponent implements OnInit {

    listingType = 'subreddit';
    subreddit = '';

    constructor(private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.activatedRoute.paramMap.subscribe(param => { this.subreddit = param.get('subreddit') });
    }

}