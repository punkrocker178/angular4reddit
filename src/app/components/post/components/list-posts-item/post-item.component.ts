import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { Router, UrlTree } from '@angular/router';
import { VotingService } from 'src/app/services/vote.service';

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
    private votingService: VotingService) { }

  ngOnInit() {
    this.parseImgUrl();
  }

  hasImages() {
    return !!this.post.data['preview'] && this.post.data['preview']['enabled'];
  }

  isVideo() {
    return this.post.data['is_video'] || this.post.data['media'];
  }

  getVideo() {

    //  Get embeded link from iframe element returned
    if (!this.post.data['is_video']) {
      const iframeHtml = this.post.data['media']['oembed']['html'];
      const srcAttr = iframeHtml.match(/src="(.*?)"/g)[0];
      const srcValue = srcAttr.match(/"(.*?)"/g)[0].replace(/amp;/g, '');

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
      }else {
        image = images[0]['source']['url'];
      }
      
    }
    
    return image;
  }

  viewDetail() {
    !this.isDetail && this.router.navigateByUrl(`/r/${this.post.data['subreddit']}/comments/${this.post.data['id']}`)
  }

  isCrossPost() {
    return this.post.data['crosspost_parent'] && this.post.data['crosspost_parent_list'];
  }

  parseImgUrl() {
    if (this.post.data['preview']) {
      this.post.data['preview']['images'].forEach((image) => {
        image.source.url = image.source.url.replace(/(amp;)/g, '');
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