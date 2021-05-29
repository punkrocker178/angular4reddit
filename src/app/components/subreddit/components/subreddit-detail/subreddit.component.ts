import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { switchMap, tap } from 'rxjs/operators';
import { Utils } from '../../../../class/Utils';
import { Observable } from 'rxjs';


@Component({
    selector: 'subreddit',
    templateUrl: './subreddit.component.html'
})

export class SubredditComponent implements OnInit {

    subredditAboutOb: Observable<any[]>;
    subredditRulesOb: Observable<any[]>;
    subredditLinkFlairsOb: Observable<any[]>;
    subreddit: string;
    isRuleLoading: boolean;
    listingType = 'subreddit';
    subredditData: any;
    subredditRulesData: any;
    subredditFlairData = [];
    activeBannerTab = 0;

    bannerTabActiveStatus = [
        true,
        false,
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
            tap((param: any) => {
                const subreddit = param.get('subreddit');
                this.subreddit = subreddit;

                this.subredditRulesOb = this.subredditService.getSubredditRules(subreddit).pipe(tap((next: any) => {
                    this.isRuleLoading = false;
                    this.subredditRulesData = next.rules;
                    this.collapseElementStatusArr = new Array(this.subredditRulesData.length);
                }));

                this.subredditLinkFlairsOb = this.subredditService.getSubredditLinkFlairs(subreddit).pipe(tap((next: any) => {
                    this.subredditFlairData = [];
                    next.map(flair => {
                        this.subredditFlairData.push({
                            flair_text: flair.text,
                            flair_richtext: flair.richtext,
                            flair_background_color: flair.background_color
                        });
                    })
                }));
            }),
            switchMap((param) => {
                const subreddit = param.get('subreddit');
                this.subredditRulesData = null;
                return this.subredditService.getSubredditAbout(`r/${subreddit}`);
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

    changeTab(event, tabIndex: number) {
        event.preventDefault();
        this.bannerTabActiveStatus = new Array(4).fill(false);
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