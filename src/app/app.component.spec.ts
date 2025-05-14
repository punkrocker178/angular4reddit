import { CommonModule } from '@angular/common';
import { HttpClient, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { HeaderFooterModule } from './components/header-footer/header-footer.module';
import { HomeComponent } from './components/home/home.component';
import { ListingsComponent } from './components/listings/listings.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostsModule } from './components/post/posts.module';
import { SearchModule } from './components/search/search.module';
import { SubredditComponent } from './components/subreddit/components/subreddit-detail/subreddit.component';
import { UserProfileComponent } from './components/user/components/user/user-profile.component';
import { DirectivesModule } from './directives/directives.module';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { PipeModule } from './pipe/pipe.module';
import { CheckDeviceFeatureService } from './services/check-device-feature.service';
import { LocalStorageService } from './services/localStorage.service';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { RedditListingService } from './services/reddit-listing.service';
import { RedditSearchService } from './services/reddit-search.service';
import { RedditSubmitService } from './services/reddit-submit.service';
import { SubredditService } from './services/subreddit.service';
import { TrumbowygService } from './services/trumbowyg.service';
import { UserService } from './services/user.service';
import { VotingService } from './services/vote.service';
import { SharedModule } from './shared/components/shared-components.module';
import { SharedDirectivesModule } from './shared/directives/directives.module';

describe('AppComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
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
    imports: [RouterTestingModule,
        CommonModule,
        BrowserModule,
        AppRoutingModule,
        HeaderFooterModule,
        PipeModule,
        PostsModule,
        InfiniteScrollModule,
        DirectivesModule,
        SharedDirectivesModule,
        SharedModule,
        NgbModule,
        SearchModule],
    providers: [
        RedditAuthenticateService,
        HttpClient,
        RedditListingService,
        LocalStorageService,
        VotingService,
        SubredditService,
        UserService,
        TrumbowygService,
        RedditSubmitService,
        RedditSearchService,
        CheckDeviceFeatureService,
        { provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ]
}).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'areddit'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('areddit');
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const component  = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});
