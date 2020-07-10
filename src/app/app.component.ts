import { Component } from '@angular/core';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'areddit';

  constructor(private authenService: RedditAuthenticateService) { }

  ngOnInit() {
    
  }
}
