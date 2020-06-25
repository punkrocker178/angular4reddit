import { Component, OnInit } from '@angular/core';
import { RedditListingService } from 'src/app/services/reddit-listing.service';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { ApiList } from 'src/app/constants/api-list';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  posts: Observable<Post[]>;

  title: string = "Home";
  constructor(private redditService: RedditListingService) { }

  ngOnInit(): void {
    this.redditService.getListigs(ApiList.LISTINGS_HOT).subscribe((data) => {
      console.log(data);
    }
    );
  }

}
