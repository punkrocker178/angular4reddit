import { Component } from '@angular/core';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalStorageService } from './services/localStorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'areddit';

  constructor(private authenService: RedditAuthenticateService,
              private localStorage: LocalStorageService) { }

  ngOnInit() {
    if (!this.localStorage.get('userToken')) {
      this.localStorage.set('isLoggedIn', false);
      this.authenService.loginAppOnly().subscribe();
    }
  }
}
