import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
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

    subredditAboutOb;
    subredditRulesOb;
    isRuleLoading: boolean;
    listingType = 'subreddit';
    subreddit = '';
    subredditData: any;
    subredditRulesData: any;
    activeBannerTab = 0;

    bannerTabActiveStatus = [
        true,
        false,
        false,
    ];

    collapseElementStatusArr;

    @ViewChildren('collapseText') collapseTextList!: QueryList<ElementRef>;

    constructor(private activatedRoute: ActivatedRoute,
                private subredditService: SubredditService) { }

    ngOnInit() {
        this.isRuleLoading = true;
         this.subredditAboutOb = this.activatedRoute.paramMap.pipe(
            switchMap((param) => {
                this.subreddit = param.get('subreddit');
                return this.subredditService.getSubredditAbout(`r/${this.subreddit}`);
            }),
            tap((next:any) => {
                this.subredditData = next.data;
                this.clearImages();
                this.subredditRulesOb = this.subredditService.getSubredditRules(this.subreddit).pipe(tap((next: any) => {
                    this.isRuleLoading = false;
                    this.subredditRulesData = next.rules;
                    this.collapseElementStatusArr = new Array(this.subredditRulesData.length);
                }));
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

    changeTab(event, tabIndex: number) {
        event.preventDefault();
        this.bannerTabActiveStatus = [false, false, false];
        this.bannerTabActiveStatus[tabIndex] = true;
        this.activeBannerTab = tabIndex;
    }

    toggleCollapseElement(index) {
        if (!this.collapseElementStatusArr[index]) {
            this.collapseElementStatusArr[index] = true;
        } else {
            this.collapseElementStatusArr[index] = false;
        }    
    }

}