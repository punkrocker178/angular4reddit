import { Component, OnInit } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { ApiList } from 'src/app/constants/api-list';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  posts: Observable<Post[]>;

  title: string = "Home";
  private user: any;

  constructor(private redditService: RedditListingService, private authenService: RedditAuthenticateService) { }

  ngOnInit(): void {

    this.redditService.getListigs(ApiList.LISTINGS_HOT, {limit: 25}).subscribe((data) => {
      console.log(data);
    });

  }

  login() {
    this.authenService.login();
  }

}
