import { PostComponent } from './components/list-posts-item/post.component';
import { NgModule } from '@angular/core';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { CommonModule } from '@angular/common';

@NgModule({
    imports:[
        PipeModule,
        CommonModule
    ],
    declarations: [
        PostComponent,
        PostDetailComponent
    ],
    exports: [
        PostComponent,
        PostDetailComponent
    ]
  })
  export class PostsModule { }