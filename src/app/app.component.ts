import { Component, OnInit } from '@angular/core';
import { RedditAuthenticateService } from './services/reddit-authenticate.service';
import { LocalStorageService } from './services/localStorage.service';
import { ThemeService } from './services/theme.service';
import { PreferencesService } from './services/preferences.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'areddit';

  constructor(private authenService: RedditAuthenticateService,
    private localStorage: LocalStorageService,
    private themeService: ThemeService,
    private preferenceService: PreferencesService) { }

  ngOnInit() {
    this.preferenceService.initPreference();

    const theme = this.localStorage.get('prefs')['theme'];
    this.themeService.changeTheme(theme);

    if (!this.localStorage.get('userToken')) {
      this.localStorage.set('isLoggedIn', false);
      this.authenService.loginAppOnly().subscribe();
    }
  }
}
