import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Utils } from '../../class/Utils';


@Component({
    selector: 'subreddit',
    templateUrl: './subreddit.component.html'
})

export class SubredditComponent implements OnInit {

    subscription;
    listingType = 'subreddit';
    subreddit = '';
    subredditData: any;

    constructor(private activatedRoute: ActivatedRoute,
                private subredditService: SubredditService,
                private renderer2: Renderer2) { }

    ngOnInit() {
         this.activatedRoute.paramMap.pipe(
            switchMap((param) => {
                this.subreddit = param.get('subreddit');
                return this.subscription = this.subredditService.getSubredditAbout(`r/${this.subreddit}`);
            }),
            tap((next:any) => {
                console.log(next, 'next');
                this.subredditData = next.data;    
                this.clearImages();
            })).subscribe();
    }

    clearImages() {
        if (this.subredditData.banner_img) {
            this.subredditData.banner_img = Utils.clearUrl(this.subredditData.banner_img);
        }

        if (this.subredditData.community_icon) {
            this.subredditData.community_icon = Utils.clearUrl(this.subredditData.community_icon);
        }

        if (this.subredditData.icon_img) {
            this.subredditData.icon_img = Utils.clearUrl(this.subredditData.icon_img);
        }
    }

}