import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { SharedModule } from 'src/app/shared/components/shared-components.module';
import { PostsModule } from '../post/posts.module';
import { SubredditModule } from '../subreddit/subreddit.module';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PipeModule,
    PostsModule,
    SearchRoutingModule,
    SubredditModule,
    SearchBarComponent
  ],
  declarations: [
    SearchPageComponent,
  ],
  exports: [
    SearchPageComponent
  ]
})
export class SearchModule { }
