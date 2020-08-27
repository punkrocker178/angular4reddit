import { Component, Input } from '@angular/core';
import { Post } from 'src/app/model/post';

@Component({
    selector: 'post-detail',
    templateUrl: './post-detail.html'
  })
export class PostDetailComponent {
  @Input() post: Post;
}