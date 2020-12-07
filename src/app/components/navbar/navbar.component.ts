import { Component, OnInit } from '@angular/core';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { User } from 'src/app/model/user';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html'
})

export class NavbarComponent implements OnInit{

    constructor(private authenService: RedditAuthenticateService) { }
    user: User;

    ngOnInit() {
        this.user = this.authenService.getUser();
    }

    login() {
        this.authenService.login();
    }

    logout() {
        this.authenService.revokeToken().subscribe(
            res => {
                if (res.ok && res.status === 200) {
                    this.authenService.logout();
                }
            }
        );
    }
}