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
import { PostComponent } from './components/post/post.component';
import { SafePipe } from './pipe/safe.pipe';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AuthenticateComponent,
    PostComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderFooter,
    InfiniteScrollModule
  ],
  providers: [
    RedditListingService,
    RedditAuthenticateService,
    LocalStorageService,
    {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
