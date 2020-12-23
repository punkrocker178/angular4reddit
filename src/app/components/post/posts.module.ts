import { PostComponent } from './components/list-posts-item/post.component';
import { NgModule } from '@angular/core';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { VoteComponent } from './components/vote/vote.component';
import { RouterModule } from '@angular/router';
import { SortComponent } from './components/sort/sort.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports:[
        PipeModule,
        InfiniteScrollModule,
        RouterModule,
        FormsModule,
        CommonModule
    ],
    declarations: [
        PostComponent,
        PostDetailComponent,
        PostCommentsComponent,
        VoteComponent,
        SortComponent
    ],
    exports: [
        PostComponent,
        PostDetailComponent,
        PostCommentsComponent,
        SortComponent
    ]
  })
  export class PostsModule { }