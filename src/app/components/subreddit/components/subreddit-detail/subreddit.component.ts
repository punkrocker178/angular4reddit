import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SubredditService } from 'src/app/services/subreddit.service';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { Utils } from '../../../../class/Utils';
import { Observable, of } from 'rxjs';
import { SubredditAbout, SubredditData, SubredditRule, SubredditRulesResponse, LinkFlair } from 'src/app/model/subreddit.interface';
import { FlairData } from 'src/app/model/post';

@Component({
    selector: 'app-subreddit',
    templateUrl: './subreddit.component.html',
    styleUrls: ['./subreddit.component.less'],
    standalone: false
})

export class SubredditComponent implements OnInit {

  subredditAboutOb: Observable<SubredditAbout>;
  subredditRulesOb: Observable<SubredditRulesResponse>;
  subredditLinkFlairsOb: Observable<LinkFlair[]>;
  subreddit: string;
  isRuleLoading: boolean;
  listingType = 'subreddit';
  subredditData: SubredditData;
  subredditRulesData: SubredditRule[];
  subredditFlairData: FlairData[] = [];
  activeBannerTab = 0;

  bannerTabActiveStatus = [
    true,
    false,
    false,
    false,
  ];

  collapseElementStatusArr: boolean[];

  @ViewChildren('collapseText') collapseTextList!: QueryList<ElementRef>;

  constructor(private activatedRoute: ActivatedRoute,
    private subredditService: SubredditService,
    private router: Router) { }

  ngOnInit() {
    this.isRuleLoading = true;
    this.subredditAboutOb = this.activatedRoute.paramMap.pipe(
      tap((param: ParamMap) => {
        const subreddit = param.get('subreddit');
        this.subreddit = subreddit;

        this.subredditRulesOb = this.subredditService.getSubredditRules(subreddit).pipe(tap((next: SubredditRulesResponse) => {
          this.isRuleLoading = false;
          this.subredditRulesData = next.rules;
          this.collapseElementStatusArr = new Array(this.subredditRulesData.length);
        }));

        this.subredditLinkFlairsOb = this.subredditService.getSubredditLinkFlairs(subreddit).pipe(
          filter(data => !!data),
          tap((next: LinkFlair[]) => {
            this.subredditFlairData = [];
            next.map(flair => {
              this.subredditFlairData.push({
                flair_text: flair.text,
                flair_richtext: flair.richtext as FlairData['flair_richtext'],
                flair_background_color: flair.background_color
              });
            })
          }),
          catchError(err => {
            this.subredditFlairData = [];
            return of(null);
          })
        );
      }),
      switchMap((param: ParamMap) => {
        const subreddit = param.get('subreddit');
        this.subredditRulesData = null;
        return this.subredditService.getSubredditAbout(`r/${subreddit}`);
      }),
      tap((next: SubredditAbout) => {
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

  changeTab(event: Event, tabIndex: number): void {
    event.preventDefault();
    this.bannerTabActiveStatus = new Array(4).fill(false);
    this.bannerTabActiveStatus[tabIndex] = true;
    this.activeBannerTab = tabIndex;
  }

  toggleCollapseElement(index: number): void {
    if (!this.collapseElementStatusArr[index]) {
      this.collapseElementStatusArr[index] = true;
    } else {
      this.collapseElementStatusArr[index] = false;
    }
  }

  filterByFlair(flair: FlairData): void {
    const flairText = flair.flair_text || flair.flair_richtext?.[0]?.t;
    this.router.navigate([`/r/${this.subreddit}/`], { queryParams: { flair: flairText } });
  }

}
