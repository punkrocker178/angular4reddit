import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from "src/app/services/user.service";
import { PreferencesService } from "src/app/services/preferences.service";
import { UserInterface } from "src/app/model/user.interface";

@Component({
    selector: 'authenticate',
    templateUrl: './authenticate.component.html'
})

export class AuthenticateComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject();
    data = {};

    constructor(
        private activatedRoute: ActivatedRoute, 
        private authenService: RedditAuthenticateService,
        private localStorage: LocalStorageService,
        private userService: UserService,
        private preferenceService: PreferencesService,
        private router: Router) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['code'] && params['state'] === this.localStorage.get('state')) {
                this.data['code'] = params['code'];
                this.authenService.getBearerAPI(params['code']).subscribe(res => {

                    if (res['token_type'] === 'bearer') {
                        this.authenService.getUserInfo()
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe((res: UserInterface) => {
                            this.authenService.storeUserDetail(res);
                            this.userService.setUser(res);
                            this.preferenceService.setPreference('safeBrowsing', !res.over_18)
                            this.router.navigateByUrl('/home');
                        });
                    }

                });
            }
        });
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}