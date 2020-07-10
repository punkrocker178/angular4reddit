import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderFooter } from './components/header-footer/header-footer.module';
import { RedditListingService } from './services/reddit-listing.service';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { AuthenticateComponent } from './components/authenticate/authenticate.component';
import { LocalStorageService } from './services/localStorage.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderFooter
  ],
  providers: [
    RedditListingService,
    RedditAuthenticateService,
    LocalStorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
