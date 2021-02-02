import { Component, Input, ElementRef, Renderer2 } from '@angular/core';
import { Post } from 'src/app/model/post';
import { Router } from '@angular/router';
import { VotingService } from 'src/app/services/vote.service';
import { Utils } from 'src/app/class/Utils';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'post-item',
  templateUrl: './post-item.html'
})
export class PostItemComponent {
  @Input() post: Post;
  @Input() isDetail: boolean;

  isUpVoted = false;
  isDownVoted = false;
  liked: boolean;

  constructor(private router: Router,
    private votingService: VotingService,
    private renderer2: Renderer2,
    private el: ElementRef) { }

  ngOnInit() {
    this.parseImgUrl();

  }

  hasImages() {
    return !!this.post.data['preview'] && this.post.data['preview']['enabled'];
  }

  isVideo() {
    return this.post.data['is_video'] || this.post.data['media'];
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
     && !this.post.data['is_reddit_media_domain']
     && !this.post.data['url'].includes('https://www.reddit.com');
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

}