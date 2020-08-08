import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { LocalStorageService } from 'src/app/services/localStorage.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
        private router: Router) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params['code'] && params['state'] === this.localStorage.get('state')) {
                this.data['code'] = params['code'];
                this.authenService.getBearerAPI(params['code']).subscribe(res => {

                    if (res['token_type'] === 'bearer') {
                        this.localStorage.set('userToken', res['access_token']);
                        this.localStorage.set('refreshToken', res['refresh_token']);
                        this.localStorage.set('initTime', Date.now().toString());
                        this.authenService.getUserInfo()
                        .pipe(takeUntil(this.ngUnsubscribe))
                        .subscribe(res => {
                            this.authenService.setUserValue('name', res['name']);
                            this.authenService.setUserValue('karma', res['comment_karma'] + res['link_karma']);
                            this.authenService.storeUserDetail(res);
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