import { Component, Input, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { Post } from 'src/app/model/post';
import { Router } from '@angular/router';
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
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { tap } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast.service';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { LoginPromptComponent } from 'src/app/components/modals/login-required/login-prompt.component';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

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
  @ViewChild('flairElement') flairEl: ElementRef

  isUpVoted = false;
  isDownVoted = false;
  isSaved: boolean;
  isSaving: boolean;
  liked: boolean;
  over18_consent: boolean;
  embedSrc: string;

  hlsPlayer: Hls;
  dashPlayer: dashjs.MediaPlayerClass;

  flairText: string;
  flairEmoji: string;

  imageSrc: string;
  videoSrc: string;
  videoThumbnailSrc: string;

  isInitVideo: boolean;
  isInitVideoErr: boolean;
  videoPlayerError: string;
  isWidescreenVideo: boolean;

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
    private listingService: RedditListingService,
    private modalService: NgbModal,
    private userService: UserService,
    private renderer2: Renderer2,
    private toastService: ToastService,
    private authenticateService: RedditAuthenticateService,
    private checkDeviceFeatureService: CheckDeviceFeatureService) { }

  ngOnInit() {
    this.over18_consent = this.userService.isNSFWAllowed();
    this.isSaved = this.post.data['saved'];

    if (this.isGallery()) {
      this.getGalleryImages();
    }

    if (this.isTwitchEmbedded()) {
      const src = this.getVideoSource();
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

    if (this.hasImages()) {
      this.imageSrc = this.getImageSource();
    }

    this.videoSrc = this.getVideoSource();
    this.videoThumbnailSrc = this.getThumbnailSource();

    if (this.post.data['preview']) {
      this.isWidescreenVideo = this.isWideScreen(this.post.data['preview']['images']);
    }
    
    if (this.hasFlair()) {
      this.flairText = this.getFlair();
    }

    if (this.flairHasEmoji()) {
      this.flairEmoji = this.getEmojiFlair();
    }

  }

  ngAfterViewInit() {
    if (this.isEmbededLink() && this.isTwitterEmbedded()) {
      this.initTwitter();
    }

    if (this.hasFlair() && this.post.data['link_flair_background_color']) {
      this.renderer2.setStyle(this.flairEl.nativeElement, 'background-color', this.post.data['link_flair_background_color']);
      this.renderer2.setStyle(this.flairEl.nativeElement, 'border-color', this.post.data['link_flair_background_color']);
      this.renderer2.setStyle(this.flairEl.nativeElement, 'color', '#FFFFFF');
    }
  }

  playVideo() {
    if (!this.isEmbededLink() && !this.isMediaEmbed() && this.isVideo()) {
      this.initVideo();
    }
  }

  initVideo() {
    try {
      if (this.checkDeviceFeatureService.isAppleDevices()) {
        this.initHlsPlayer();
      } else {
        this.initDashPlayer();
      }

      this.isInitVideo = true;

    } catch (err) {
      console.error(err);
      this.isInitVideoErr = true;
      this.videoPlayerError = 'Unable to load video :(';
    }

  }

  initDashPlayer() {
    try {
      let src = this.getVideoSource('dash');

      src = ReplacePipe.prototype.transform(src);
      this.dashPlayer = dashjs.MediaPlayer().create();
      this.dashPlayer.initialize();
      this.dashPlayer.setAutoPlay(false);
      this.dashPlayer.attachSource(src);
      this.dashPlayer.attachView(this.videoPlayer.nativeElement);
      this.dashPlayer.setVolume(0.5);
    } catch (err) {
      throw err;

    }
  }

  initHlsPlayer() {
    try {
      let src = this.getVideoSource('hls');
      /**
       * First check for native browser HLS support else use Hls.js
       */
      if (this.videoPlayer.nativeElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.videoPlayer.nativeElement.src = src;
      } else if (Hls.isSupported()) {
        this.hlsPlayer = new Hls();
        this.hlsPlayer.loadSource(src);
        this.hlsPlayer.attachMedia(this.videoPlayer.nativeElement);

        this.hlsPlayer.on(Hls.Events.ERROR, function (event, data) {
          const errorType = data.type;
          const errorDetails = data.details;
          const errorFatal = data.fatal;
          console.error(errorDetails);
        });
      }
    } catch (err) {
      throw err;
    }
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

  isWideScreen (images): boolean {
    return images[0]['source']['width'] > images[0]['source']['height'];
  }

  getVideoSource(type?: string) {
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
      (type === 'dash' ? dashUrl : hlsUrl) : fallbackUrl;

    return src;
  }

  getThumbnailSource() {

    if(this.post.data['preview'] && this.post.data['preview']['images'].length > 0) {
      const images = this.post.data['preview']['images'];
      const resolutionIndex = Math.floor(images[0]['resolutions'].length / 2);
      return this.getSmallerImage(images[0]['resolutions'], resolutionIndex);
    }

    if (this.post.data['thumbnail']) {
      return this.post.data['thumbnail'];
    }
  }

  getImageSource() {
    const images = this.post.data['preview']['images'];
    let image = '';
    if (images.length > 0) {
      if (images[0]['variants'] && images[0]['variants']['gif']) {
        image = this.getImage(images[0]['variants']['gif']);
      } else {
        image = this.getImage(images);
      }
    }

    return image;
  }

  getImage(data) {
    let image, resolutions, images;
    
    // GIFs
    if (data['resolutions']) {
      resolutions = data['resolutions'];
      images = data;
    }

    // Images
    if (data[0] && data[0]['resolutions']) {
      resolutions = data[0]['resolutions'];
      images = data[0];
    }

    if ((resolutions[resolutions.length - 1] && resolutions[resolutions.length - 1]['height'] < 300) || this.isDetail) {
      image = images['source']['url'];
    } else {
        try {
          image = this.getSmallerImage(resolutions, resolutions.length - 1);
        } catch(err) {
          image = this.getSmallerImage(resolutions, Math.ceil(resolutions.length / 2));
        }
    }

    return image;
  }

  getSmallerImage(resolutionArr, resolutionIndex) {

    if (resolutionArr.length === 0) {
      return '';
    }

    return resolutionArr[resolutionIndex]['url'];
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

        if (media) {
          item.source = media['u'];
        }

      }

    });

  }

  hasFlair() {
    return this.post.data['link_flair_text'] ||
      (this.post.data['link_flair_richtext'] && this.post.data['link_flair_richtext'].length > 0);
  }

  getFlair() {
    // Replace encoded special characters
    const replaceObj = {
      '&amp;': '&',
      '&gt;': '>',
      '&lt;': '<',
      '&quot': '"'
    }

    const regex = new RegExp(Object.keys(replaceObj).join('|'), 'g');

    let flairText;

    if (this.post.data['link_flair_richtext'].length > 1) {
      const flairRichText = this.post.data['link_flair_richtext'];
      const flairArr = flairRichText.filter(part => part['e'] === 'text');
      if (flairArr.length > 0) {
        flairText = flairArr[0]['t'].replace(regex, (match) => replaceObj[match]);
      }
      return flairText;
    }

    flairText = this.post.data['link_flair_text'].replace(regex, (match) => replaceObj[match]);
    return flairText;
  }

  getEmojiFlair() {
    return (this.post.data['link_flair_richtext'][0] && this.post.data['link_flair_richtext'][0]['u']);
  }

  flairHasEmoji() {
    if (this.post.data['link_flair_richtext'] && this.post.data['link_flair_richtext'].length == 0) {
      return false;
    }

    const flair = this.post.data['link_flair_richtext'];
    return flair &&
      flair.length > 1 &&
      flair[0]['e'] === 'emoji';
  }

  filterByFlair() {
    this.router.navigate([`${this.post.data['subreddit_name_prefixed']}/`],
      { queryParams: { flair: this.post.data['link_flair_text'] } });
  }

  save() {
    if (this.isSaving) {
      return;
    }

    if (!this.authenticateService.getIsLoggedIn()) {
      this.modalService.open(LoginPromptComponent);
    } else {
      this.isSaving = true;
      this.listingService.savePost(this.post.data['name']).pipe(tap(next => {
        this.isSaved = true;
        this.isSaving = false;
      })).subscribe();
    }
  }

  unsave() {
    if (this.isSaving) {
      return;
    }

    this.isSaving = true;
    this.listingService.unsavePost(this.post.data['name']).pipe(tap(next => {
      this.isSaved = false;
      this.isSaving = false;
    })).subscribe();
  }

  share(toastTemplate) {
    const url = `https://www.reddit.com${this.post.data['permalink']}`;

    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(url, toastTemplate);
      return;
    }

    navigator.clipboard.writeText(url)
      .then(() => {
        this.toastService.show(toastTemplate, { classname: 'toast bg-success text-light', delay: 2500 });
      });

  }

  /**
   * Reference: https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
   */

  fallbackCopyTextToClipboard(text, toastTemplate) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      const msg = successful ? 'successful' : 'unsuccessful';
      this.toastService.show(toastTemplate, { classname: 'toast bg-success text-light', delay: 2500 });
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  ngOnDestroy() {
    if (this.dashPlayer) {
      this.dashPlayer.destroy();
    }

    if (this.hlsPlayer) {
      this.hlsPlayer.destroy();
    }
  }

}