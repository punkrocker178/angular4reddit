import { Component, Input, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Post } from 'src/app/model/post';
import { Router } from '@angular/router';
import { VotingService } from 'src/app/services/vote.service';
import { Utils } from 'src/app/class/Utils';
import { HttpParams } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NsfwPopupComponent } from 'src/app/components/modals/nsfw/nsfw-popup.component';
import { UserService } from 'src/app/services/user.service';
import { DomParserPipe } from 'src/app/pipe/dom-parser.pipe';
import { Domains } from 'src/app/constants/domains';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';

declare var twttr: any;

@Component({
  selector: 'post-item',
  templateUrl: './post-item.html'
})
export class PostItemComponent {
  @Input() post: Post;
  @Input() isDetail: boolean;
  @ViewChild('twitterEmbed') tweet: ElementRef;

  isUpVoted = false;
  isDownVoted = false;
  liked: boolean;
  over18_consent: boolean;

  constructor(private router: Router,
    private votingService: VotingService,
    private modalService: NgbModal,
    private userService: UserService,
    private renderer2: Renderer2) { }

  ngOnInit() {
    this.over18_consent = this.userService.isNSFWAllowed();
    this.parseImgUrl();
  }

  ngAfterViewInit() {
    if (this.isEmbededLink() && this.isTwitterEmbedded()) {
      this.initTwitter();
    }
  }

  hasImages() {
    return !!this.post.data['preview'] && this.post.data['preview']['enabled']
    && Domains.imagesDomains.includes(this.post.data['domain']);
  }

  isVideo() {
    return (this.post.data['is_video'] || this.post.data['media']) && !this.isTwitterEmbedded();
  }

  isGallery() {
    return this.post.data['gallery_data'] && this.post.data['gallery_data'].items.length > 0;
  }

  isComment() {
    return this.post.kind === 't1';
  }

  // Needs enhancement. The logic does not cover all cases
  isEmbededLink() {
    return !this.post.data['is_self']
      && !this.post.data['selftext']
      && !this.post.data['is_reddit_media_domain'] 
      && !this.hasImages()
      && (this.post.data['url'] && !this.post.data['url'].includes('https://www.reddit.com'));
  }

  isTwitterEmbedded() {
    return this.post.data['domain'] === Domains.twitterDomain;
  }

  isOver18() {
    return this.post.data['over_18'];
  }

  getVideo() {
    //  Get embeded link from iframe element returned
    if (!this.post.data['is_video']) {
      const iframeHtml = this.post.data['media']['oembed']['html'];
      const srcAttr = iframeHtml.match(/src="(.*?)"/g)[0];
      const srcValue = Utils.clearUrl(srcAttr.match(/"(.*?)"/g)[0]);

      //  Remove double quotes
      const url = srcValue.substring(1, srcValue.length - 1);

      return decodeURI(url);
    }

    return this.post.data['media']['reddit_video']['fallback_url'];
  }

  getImage() {
    const images = this.post.data['preview']['images'];
    let image = '';
    if (images.length > 0) {

      if (images[0]['variants'] && images[0]['variants']['gif']) {
        image = images[0]['variants']['gif']['source']['url'];
      } else {
        image = images[0]['source']['url'];
      }

    }

    return image;
  }

  // Needs refactor
  viewDetail(isComment?: boolean) {

    if (this.isOver18() && !this.over18_consent) {
      const modalRef = this.modalService.open(NsfwPopupComponent);
      modalRef.result.then(result => {
        this.over18_consent = true;
      }, reason => {
        console.log(reason, 'reason');
      })
    }

    if (!this.isDetail) {
      let path = `/r/${this.post.data['subreddit']}/comments/`;

      if (isComment && this.post.data['parent_id']) {
        const parent_id = this.post.data['parent_id'].split('_');
        const params = new HttpParams()
          .set('comment', this.post.data['id']);
        path += `${parent_id[1]}?${params.toString()}`;
      } else {
        path += `${this.post.data['id']}`;
      }

      !this.isDetail && this.router.navigateByUrl(path);
    }

  }

  isCrossPost() {
    return this.post.data['crosspost_parent'] && this.post.data['crosspost_parent_list'];
  }

  parseImgUrl() {
    if (this.post.data['preview']) {
      this.post.data['preview']['images'].forEach((image) => {
        image.source.url = Utils.clearUrl(image.source.url);
      })
    }
  }

  vote(direction: number) {

    switch (direction) {
      case 1:
        if (this.isDownVoted) {
          this.post.data['score'] += direction + 1;
          this.votingService.vote(this.post.data['name'], direction.toString()).subscribe();
          this.isDownVoted = false;
        } else if (this.isUpVoted) {
          this.post.data['score'] -= 1;
          this.votingService.vote(this.post.data['name'], '0').subscribe();
        } else {
          this.post.data['score'] += direction;
          this.votingService.vote(this.post.data['name'], direction.toString()).subscribe();
        }

        this.isUpVoted = !this.isUpVoted;
        break;
      case -1:
        if (this.isUpVoted) {
          this.post.data['score'] += direction - 1;
          this.votingService.vote(this.post.data['name'], direction.toString()).subscribe();
          this.isUpVoted = false;
        } else if (this.isDownVoted) {
          this.post.data['score'] += 1;
          this.votingService.vote(this.post.data['name'], '0').subscribe();
        } else {
          this.post.data['score'] += direction;
          this.votingService.vote(this.post.data['name'], direction.toString()).subscribe();
        }

        this.isDownVoted = !this.isDownVoted;
        break;
    }

  }

  initTwitter() {
    let html = DomParserPipe.prototype.transform(this.post.data['media']['oembed']['html']);
    html = ReplacePipe.prototype.transform(html, '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
    this.renderer2.setProperty(this.tweet.nativeElement, 'innerHTML', html);
    twttr.widgets.load();
  }

}