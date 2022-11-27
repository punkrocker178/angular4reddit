import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { SharedModule } from 'src/app/shared/components/shared-components.module';
import { PostsModule } from '../post/posts.module';
import { SubredditModule } from '../subreddit/components/subreddit.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SubbredditItemComponent } from './components/search-page/components/subreddit/subbreddit-item.component';
import { SearchPageComponent } from './components/search-page/search-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PipeModule,
    PostsModule,
    SubredditModule
  ],
  declarations: [
    SearchBarComponent,
    SearchPageComponent,
    SubbredditItemComponent
  ],
  exports: [
    SearchBarComponent,
    SearchPageComponent
  ]
})
export class SearchModule { }
