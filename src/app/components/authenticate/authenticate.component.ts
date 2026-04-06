import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { of, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, takeUntil } from 'rxjs/operators';
import { UserService } from "src/app/services/user.service";
import { PreferencesService } from "src/app/services/preferences.service";
import { UserInterface } from "src/app/model/user.interface";
import { TokenResponse } from "src/app/model/token-response.interface";

@Component({
    selector: 'app-authenticate',
    templateUrl: './authenticate.component.html'
})

export class AuthenticateComponent implements OnInit, OnDestroy {
    private ngUnsubscribe = new Subject<void>();

    isError: boolean;
    errorMsg: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private authenService: RedditAuthenticateService,
        private localStorage: LocalStorageService,
        private userService: UserService,
        private preferenceService: PreferencesService,
        private router: Router) { }

    ngOnInit() {

        const getUserInfo = (res: TokenResponse) => {
            if (res['token_type'] === 'bearer') {
                return this.authenService.getUserInfo()
            }

            if (res['error']) {
                throw throwError(res['error']);
            }
        };

        const getAccessToken = (params: Params) => {
            if (params['code'] && params['state'] === this.localStorage.get<string>('state')) {
                return this.authenService.getBearerToken(params['code']).pipe(
                    mergeMap(getUserInfo)
                )
            }

            if (params['error']) {
                throw throwError(params['error']);
            }
        };

        this.activatedRoute.queryParams.pipe(
            takeUntil(this.ngUnsubscribe),
            mergeMap(getAccessToken),
            catchError(error => {
                return error;
            })
        ).subscribe(
            (data: UserInterface) => {
                this.authenService.storeUserToStorage({ ...data, is_login: true });
                this.userService.intializeUser({ ...data, is_login: true });
                this.preferenceService.setPreference('safeBrowsing', !data.over_18)
                this.router.navigateByUrl('/home');
            }, err => {
                this.errorMsg = err;
            }
        );
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
