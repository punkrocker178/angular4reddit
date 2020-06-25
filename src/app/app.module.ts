import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { HeaderFooter } from './components/header-footer/header-footer.module';
import { RedditListingService } from './services/reddit-listing.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HeaderFooter
  ],
  providers: [
    RedditListingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
