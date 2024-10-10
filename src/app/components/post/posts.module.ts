import { PostItemComponent } from './components/list-posts-item/post-item.component';
import { NgModule } from '@angular/core';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { CommonModule } from '@angular/common';
import { PostCommentsComponent } from './components/post-comments/post-comments.component';
import { VoteComponent } from './components/vote/vote.component';
import { RouterModule } from '@angular/router';
import { SortComponent } from './components/sort/sort.component';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { AwardComponent } from './components/award/award.component';
import { SharedModule } from 'src/app/shared/components/shared-components.module';
import { CommentComponent } from './components/comment/components/comment-detail/comment.component';
import { CommentEditorComponent } from './components/comment/components/comment-editor/comment-editor.component';
import { SubmissionItemComponent } from './components/submission/submission-item.component';
import { GalleryComponent } from '../gallery/gallery.component';
import { ListingsComponent } from '../listings/listings.component';
import { FlairComponent } from './components/flair/flair.component';
import { FormsModule } from '@angular/forms';
import {
  RxFor
} from '@rx-angular/template/for';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipeModule,
    RouterModule,
    DirectivesModule,
    SharedModule,
    RxFor
  ],
  declarations: [
    ListingsComponent,
    PostItemComponent,
    SubmissionItemComponent,
    PostDetailComponent,
    PostCommentsComponent,
    CommentComponent,
    VoteComponent,
    SortComponent,
    AwardComponent,
    CommentEditorComponent,
    GalleryComponent,
    FlairComponent
  ],
  exports: [
    ListingsComponent,
    PostItemComponent,
    SubmissionItemComponent,
    PostDetailComponent,
    PostCommentsComponent,
    CommentComponent,
    SortComponent,
    AwardComponent,
    FlairComponent
  ]
})
export class PostsModule { }
