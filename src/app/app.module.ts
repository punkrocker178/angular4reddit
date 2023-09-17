import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderFooterModule } from './components/header-footer/header-footer.module';
import { RedditListingService } from './services/reddit-listing.service';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { LocalStorageService } from './services/localStorage.service';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { PipeModule } from './pipe/pipe.module';
import { VotingService } from './services/vote.service';
import { SubredditService } from './services/subreddit.service';
import { DirectivesModule } from './directives/directives.module';
import { UserService } from './services/user.service';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SharedModule } from './shared/components/shared-components.module';
import { TrumbowygService } from './services/trumbowyg.service';
import { RedditSubmitService } from './services/reddit-submit.service';
import { CheckDeviceFeatureService } from './services/check-device-feature.service';
import { RedditSearchService } from './services/reddit-search.service';
import { ModalModule } from './components/modals/modal.module';
import { ToastService } from './services/toast.service';
import { ToastsContainerComponent } from './components/toast/toast-container/toast-container.component';
import { ThemeService } from './services/theme.service';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { PreferencesService } from './services/preferences.service';
import { FeaturesModule } from './components/features.module';
import { FormsModule } from '@angular/forms';
import { NavbarModule } from './components/navbar/navbar.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticateComponent,
    NotFoundComponent,
    ToastsContainerComponent,
    PreferencesComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HeaderFooterModule,
    PipeModule,
    DirectivesModule,
    SharedModule,
    ModalModule,

    NavbarModule,
    FeaturesModule
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
    { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
