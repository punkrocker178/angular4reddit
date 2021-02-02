import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderFooter } from './components/header-footer/header-footer.module';
import { RedditListingService } from './services/reddit-listing.service';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { LocalStorageService } from './services/localStorage.service';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostsModule } from './components/post/posts.module';
import { CommonModule } from '@angular/common';
import { PipeModule } from './pipe/pipe.module';
import { ListingsComponent } from './components/listings/listings.component';
import { VotingService } from './services/vote.service';
import { SubredditComponent } from './components/subreddit/subreddit.component';
import { UserProfileComponent } from './components/user/user-profile.component';
import { SubredditService } from './services/subreddit.service';
import { DirectivesModule } from './directives/directives.module';
import { UserService } from './services/user.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SharedDirectivesModule } from './shared/directives/directives.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SubredditComponent,
    UserProfileComponent,
    ListingsComponent,
    NavbarComponent,
    AuthenticateComponent,
    NotFoundComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderFooter,
    PipeModule,
    PostsModule,
    InfiniteScrollModule,
    DirectivesModule,
    SharedDirectivesModule,
    NgbModule
  ],
  providers: [
    RedditListingService,
    RedditAuthenticateService,
    LocalStorageService,
    VotingService,
    SubredditService,
    UserService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
