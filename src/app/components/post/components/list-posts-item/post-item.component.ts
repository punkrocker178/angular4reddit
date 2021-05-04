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
import Hls from 'hls.js';
import dashjs from 'dashjs';

declare var twttr: any;

@Component({
  selector: 'post-item',
  templateUrl: './post-item.html'
})
export class PostItemComponent {
  @Input() post: Post;
  @Input() isDetail: boolean;
  @ViewChild('twitterEmbed') tweet: ElementRef;
  @ViewChild('videoPlayer') videoPlayer: ElementRef;

  isUpVoted = false;
  isDownVoted = false;
  liked: boolean;
  over18_consent: boolean;
  embedSrc: string;

  hlsPlayer: Hls;
  dashPlayer: dashjs.MediaPlayerClass;

  // Posts that don't have selft text, images, videos
  noSelfText: boolean;

  galleryConfigs = {
    src: 'source',
    position: 'top-left',
  }

  galleryData = {
    items: []
  };

  constructor(private router: Router,
    private votingService: VotingService,
    private modalService: NgbModal,
    private userService: UserService,
    private renderer2: Renderer2) {}

  ngOnInit() {
    this.over18_consent = this.userService.isNSFWAllowed();

    if (this.isGallery()) {
      this.getGalleryImages();
    }

    if (this.isTwitchEmbedded()) {
      const src = this.getVideo();
      if (src) {
        const srcArr = src.split('src=');
        let twitchSrc;

        if (srcArr.length > 0 && srcArr[0]) {
          twitchSrc = srcArr[1];
        } else {
          twitchSrc = srcArr[0];
        }

        this.embedSrc = decodeURIComponent(twitchSrc) + '&parent=localhost';
      } else {
        this.noSelfText = true;
      }
    }

    this.formatThumbnail();

  }

  ngAfterViewInit() {
    if (this.isEmbededLink() && this.isTwitterEmbedded()) {
      this.initTwitter();
    }

    if (!this.isEmbededLink() && !this.isMediaEmbed() && this.isVideo()) {
      this.initVideo();
    }
    
  }

  initVideo() {
    let src = this.getVideo('dash');

    src = ReplacePipe.prototype.transform(src);
    this.dashPlayer = dashjs.MediaPlayer().create();
    this.dashPlayer.initialize();
    this.dashPlayer.setAutoPlay(false);
    this.dashPlayer.attachSource(src);
    this.dashPlayer.attachView(this.videoPlayer.nativeElement);
    this.dashPlayer.setVolume(0.5);
  }

  formatThumbnail() {
    if (this.post.data['thumbnail'] && !this.post.data['thumbnail'].includes('https://')) {
      this.post.data['thumbnail'] = '';
    }
  }

  hasImages() {
    return !!this.post.data['preview'] && this.post.data['preview']['enabled']
      && Domains.imagesDomains.includes(this.post.data['domain']);
  }

  isVideo() {
    return (this.post.data['is_video'] || this.post.data['media']) && !this.isTwitterEmbedded() && !this.isTwitchEmbedded();
  }

  isGallery() {
    return this.post.data['is_gallery'] &&
      this.post.data['gallery_data'] && this.post.data['gallery_data'].items.length > 0;
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
      && !this.isTwitterEmbedded()
      && !this.isTwitchEmbedded()
      && !this.isVideo()
      && (this.post.data['url'] && !this.post.data['url'].includes('https://www.reddit.com'));
  }

  isTwitterEmbedded() {
    return this.post.data['domain'] === Domains.twitterDomain;
  }

  isMediaEmbed() {
    if (!this.post.data['media']) {
      return false;
    }
    return Domains.mediaEmbed.includes(this.post.data['media']['type']);
  }

  isTwitchEmbedded() {
    return this.post.data['domain'] === Domains.twitchDomain;
  }

  isOver18() {
    return this.post.data['over_18'];
  }

  getVideo(type?: string) {
    //  Get embeded link from iframe element returned
    if (!this.post.data['is_video'] && this.post.data['media']) {
      const iframeHtml = this.post.data['media']['oembed']['html'];
      const srcAttr = iframeHtml.match(/src="(.*?)"/g)[0];
      const srcValue = Utils.clearUrl(srcAttr.match(/"(.*?)"/g)[0]);

      //  Remove double quotes
      const url = srcValue.substring(1, srcValue.length - 1);

      return decodeURI(url);
    }

    if (!this.post.data['media']) {
      return null; 
    }

    const hlsUrl = this.post.data['media']['reddit_video']['hls_url'];
    const dashUrl = this.post.data['media']['reddit_video']['dash_url'];
    const fallbackUrl = this.post.data['media']['reddit_video']['fallback_url'];

    const src = this.post.data['media'] ? 
      (type === 'dash' ? dashUrl : hlsUrl) :
      this.post.data['media']['reddit_video']['fallback_url']; 

    return src;
  }

  getImage() {
    const images = this.post.data['preview']['images'];
    let image = '';
    if (images.length > 0) {

      if (images[0]['variants'] && images[0]['variants']['gif']) {
        image = images[0]['variants']['gif']['source']['url'];
      } else {
        const resolutions = images[0]['resolutions'];

        if (resolutions[resolutions.length - 1]['height'] < 300) {
          image = images[0]['source']['url'];
        } else {
          image = resolutions[resolutions.length - 1]['url'];
        }

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

      this.router.navigateByUrl(path);
    }

  }

  isCrossPost() {
    return this.post.data['crosspost_parent'] && this.post.data['crosspost_parent_list'];
  }

  initTwitter() {
    let html = DomParserPipe.prototype.transform(this.post.data['media']['oembed']['html']);
    html = ReplacePipe.prototype.transform(html, '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>', '');
    this.renderer2.setProperty(this.tweet.nativeElement, 'innerHTML', html);
    twttr.widgets.load();
  }

  getGalleryImages() {

    this.galleryData.items = this.post.data['gallery_data']['items'];
    let mediaResolutions, selectedResolution;

    this.galleryData.items.forEach(item => {
      const mediaId = item['media_id'];
      item.metadata = {
        ...this.post.data['media_metadata'][mediaId]
      };

      item.source = this.post.data['media_metadata'][mediaId]['s']['u'];

      if (!this.isDetail) {
        mediaResolutions = this.post.data['media_metadata'][mediaId]['p'];
        selectedResolution = mediaResolutions.length - 1;

        const media = this.post.data['media_metadata'][mediaId]['p'][selectedResolution];
        item.source = media['u'];
      }
  
    });

  }

  ngOnDestroy() {
    if (this.dashPlayer) {
      this.dashPlayer.destroy();
    }
  }

}