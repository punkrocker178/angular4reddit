import { PostItemComponent } from './components/list-posts-item/post-item.component';
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
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AwardComponent } from './components/award/award.component';
import { SharedDirectivesModule } from 'src/app/shared/directives/directives.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { CommentComponent } from './components/comment/comment.component';

@NgModule({
    imports:[
        PipeModule,
        InfiniteScrollModule,
        RouterModule,
        FormsModule,
        CommonModule,
        DirectivesModule,
        SharedDirectivesModule,
        SharedComponentsModule
    ],
    declarations: [
        PostItemComponent,
        PostDetailComponent,
        PostCommentsComponent,
        CommentComponent,
        VoteComponent,
        SortComponent,
        AwardComponent
    ],
    exports: [
        PostItemComponent,
        PostDetailComponent,
        PostCommentsComponent,
        CommentComponent,
        SortComponent,
        AwardComponent
    ]
  })
  export class PostsModule { }