import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DirectivesModule } from 'src/app/directives/directives.module';
import { PipeModule } from 'src/app/pipe/pipe.module';
import { HeaderFooterModule } from '../header-footer/header-footer.module';
import { PostsModule } from '../post/posts.module';
import { AboutComponent } from './components/about/about.component';
import { UserProfileComponent } from './components/user/user-profile.component';
import { UserRoutingModule } from './user-routing.module';


@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    PipeModule,
    PostsModule,
    HeaderFooterModule,
    UserRoutingModule
  ],
  declarations: [
    UserProfileComponent,
    AboutComponent
  ],
  exports: [
  ]
})
export class UserModule { }
