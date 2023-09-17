import { NgModule } from '@angular/core';
import { PostsModule } from './post/posts.module';
import { ThemeModule } from './theme/theme.module';

@NgModule({
  imports: [
    PostsModule,
    ThemeModule,
  ],
  exports: [
    PostsModule,
    ThemeModule
  ]
})
export class FeaturesModule { }
