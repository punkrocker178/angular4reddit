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
         this.subscription = this.activatedRoute.paramMap.pipe(
            switchMap((param) => {
                this.subreddit = param.get('subreddit');
                return this.subredditService.getSubredditAbout(`r/${this.subreddit}`);
            }),
            tap((next:any) => {
                this.subredditData = next.data;    
                this.clearImages();
            }));
    }

    clearImages() {
        if (this.subredditData.banner_img) {
            this.subredditData.banner_img = Utils.clearUrl(this.subredditData.banner_img);
        }

        if (this.subredditData.banner_background_image) {
            this.subredditData.banner_background_image = Utils.clearUrl(this.subredditData.banner_background_image);
        }

        if (this.subredditData.community_icon) {
            this.subredditData.community_icon = Utils.clearUrl(this.subredditData.community_icon);
        }

        if (this.subredditData.icon_img) {
            this.subredditData.icon_img = Utils.clearUrl(this.subredditData.icon_img);
        }

        if (this.subredditData.header_img) {
            this.subredditData.header_img = Utils.clearUrl(this.subredditData.header_img);
        }
    }

}