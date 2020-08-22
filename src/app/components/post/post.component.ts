import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';

@Component({
    selector: 'post-item',
    templateUrl: './post.html'
  })
export class PostComponent {
   @Input() post: Post;
}