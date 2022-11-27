import { NgModule } from '@angular/core';
import { PostsModule } from './post/posts.module';
import { SearchModule } from './search/search.module';
import { SubredditModule } from './subreddit/components/subreddit.module';
import { ThemeModule } from './theme/theme.module';
import { UserModule } from './user/user.module';

@NgModule({
  imports: [
    SearchModule,
    PostsModule,
    UserModule,
    ThemeModule,
    SubredditModule
  ],
  exports: [
    SearchModule,
    PostsModule,
    UserModule,
    ThemeModule,
    SubredditModule
  ]
})
export class FeaturesModule { }
