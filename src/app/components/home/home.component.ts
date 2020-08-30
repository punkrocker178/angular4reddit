import { Component, OnInit, OnDestroy } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable, from, merge, forkJoin, BehaviorSubject, Subscription, Subject, zip } from 'rxjs';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { Listings } from 'src/app/model/listings';
import { tap, map, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  listingsType = 'dashboard';

  ngOnInit() {

  }

}
