import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';
import { Router, UrlTree } from '@angular/router';

@Component({
    selector: 'post-item',
    templateUrl: './post.html'
  })
export class PostComponent {
  @Input() post: Post;
  @Input() isDetail: boolean;

  constructor(private router: Router) {}

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
      const url = srcValue.substring(1, srcValue.length -1);
  
      return decodeURI(url);
    }

    return this.post.data['media']['reddit_video']['fallback_url'];
  }

  getImage() {
    const image = this.post.data['preview']['images'][0]['source']['url'];
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

}