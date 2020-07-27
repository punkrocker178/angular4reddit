import { Component } from '@angular/core';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { User } from 'src/app/model/user';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html'
})

export class NavbarComponent {

    constructor(private authenService: RedditAuthenticateService) { }
    user: User;

    login() {
        this.authenService.login();
    }

    logout() {
        this.authenService.revokeToken().subscribe(
            res => {
                if (res.ok && res.status === 204) {
                    this.authenService.logout();
                }
            }
        );
    }
}