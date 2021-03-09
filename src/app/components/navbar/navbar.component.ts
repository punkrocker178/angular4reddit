import { Component, OnInit } from '@angular/core';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { UserService } from 'src/app/services/user.service';
import { UserInterface } from 'src/app/model/user.interface';
import { take, tap } from 'rxjs/operators';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    selector: 'navbar',
    templateUrl: './navbar.html'
})

export class NavbarComponent implements OnInit{

    constructor(private authenService: RedditAuthenticateService,
        private userService: UserService,
        private checkDeviceFeatureService: CheckDeviceFeatureService) { }
    user: UserInterface;
    userSubscribtion;

    ngOnInit() {
       this.userSubscribtion = this.userService.user$.pipe(
           take(2),
            tap(next => {
                this.user = next;
            })
        );
    }

    isLoggedIn() {
        return this.authenService.getIsLoggedIn();
    }

    login() {
        this.authenService.login();
    }

    logout() {
        this.authenService.revokeToken().subscribe(
            res => {
                if (res.ok && res.status === 200) {
                    this.userService.setUser({
                        name: 'anonymous'
                    });
                    this.authenService.logout();
                }
            }
        );
    }

    isMobile() {
        return this.checkDeviceFeatureService.isMobile();
    }
}