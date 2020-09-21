import { PostComponent } from './components/list-posts-item/post.component';
import { NgModule } from '@angular/core';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
    imports:[
        PipeModule,
        InfiniteScrollModule,
        CommonModule
    ],
    declarations: [
        PostComponent,
        PostDetailComponent,
        PostCommentsComponent
    ],
    exports: [
        PostComponent,
        PostDetailComponent,
        PostCommentsComponent
    ]
  })
  export class PostsModule { }