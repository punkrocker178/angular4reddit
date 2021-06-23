import { Component } from '@angular/core';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { LocalStorageService } from './services/localStorage.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'areddit';

  constructor(private authenService: RedditAuthenticateService,
              private localStorage: LocalStorageService, 
              private themeService: ThemeService) { }

  ngOnInit() {
    this.themeService.changeTheme('dark');
    
    if (!this.localStorage.get('userToken')) {
      this.localStorage.set('isLoggedIn', false);
      this.authenService.loginAppOnly().subscribe();
    }
  }
}
