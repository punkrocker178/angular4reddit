import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { PostsModule } from '../post/posts.module';
import { SubredditComponent } from './components/subreddit-detail/subreddit.component';
import { SubbredditItemComponent } from './components/subreddit-item/subbreddit-item.component';
import { SubscribeSubredditBtnComponent } from './components/subscribe-subreddit-btn/subscribe-subreddit-btn.component';
import { SubredditRoutingModule } from './subreddit-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    PipeModule,
    PostsModule,
    SubredditRoutingModule
  ],
  declarations: [
    SubredditComponent,
    SubscribeSubredditBtnComponent,
    SubbredditItemComponent
  ],
  exports: [
    SubredditComponent,
    SubscribeSubredditBtnComponent,
    SubbredditItemComponent
  ]
})
export class SubredditModule { }
