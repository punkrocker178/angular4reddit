import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';

@Component({
    selector: 'post-item',
    templateUrl: './post.html'
  })
export class PostComponent {
  @Input() post: Post;

  hasImages() {
    return !!this.post.data['preview'] && this.post.data['preview']['enabled'];
  }

  isVideo() {
    return this.post.data['is_video'];
  }

  getVideo() {
    return this.post.data['media']['reddit_video']['fallback_url'];
  }

  getImage() {
    const image = this.post.data['preview']['images'][0]['source']['url'];
    return image;
  }

  viewDetail() {
    console.log('clicked');
  }

}