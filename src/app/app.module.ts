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
import { UserProfileComponent } from './components/user/user-profile.component';
import { SubredditService } from './services/subreddit.service';
import { DirectivesModule } from './directives/directives.module';
import { UserService } from './services/user.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SharedDirectivesModule } from './shared/directives/directives.module';
import { NgbDropdownModule, NgbModalModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { TrumbowygService } from './services/trumbowyg.service';
import { RedditSubmitService } from './services/reddit-submit.service';
import { CheckDeviceFeatureService } from './services/check-device-feature.service';
import { SearchModule } from './components/search/search.module';
import { RedditSearchService } from './services/reddit-search.service';
import { ModalModule } from './components/modals/modal.module';
import { ToastService } from './services/toast.service';
import { ToastsContainer } from './components/toast/toast-container/toast-container.component';
import { SubredditModule } from './components/subreddit/components/subreddit.module';
import { ThemeService } from './services/theme.service';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { PreferencesService } from './services/preferences.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UserProfileComponent,
    NavbarComponent,
    AuthenticateComponent,
    NotFoundComponent,
    ToastsContainer,
    PreferencesComponent
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
    SharedComponentsModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbToastModule,
    SearchModule,
    ModalModule,
    SubredditModule
  ],
  providers: [
    RedditListingService,
    RedditAuthenticateService,
    LocalStorageService,
    VotingService,
    SubredditService,
    UserService,
    TrumbowygService,
    RedditSubmitService,
    RedditSearchService,
    CheckDeviceFeatureService,
    ToastService,
    ThemeService,
    PreferencesService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
