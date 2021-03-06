import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { PostsModule } from '../../post/posts.module';
import { SubredditComponent } from './subreddit-detail/subreddit.component';
import { SubscribeSubredditBtnComponent } from './subscribe-subreddit-btn/subscribe-subreddit-btn.component';


@NgModule({
    imports:[
        CommonModule,
        DirectivesModule,
        PipeModule,
        PostsModule
    ],
    declarations: [
        SubredditComponent,
        SubscribeSubredditBtnComponent
    ],
    exports: [
        SubredditComponent,
        SubscribeSubredditBtnComponent
    ]
  })
  export class SubredditModule { }