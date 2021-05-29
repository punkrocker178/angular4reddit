import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { ApiList } from '../constants/api-list';
import { HeadersUtils } from '../class/HeadersUtils';
import { Utils } from '../class/Utils';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable()
export class RedditAuthenticateService {

    redirectURI: string;

    private getAccessTokenAPI = environment.functionUrl + '/api/v1/access_token';
    private getRevokeTokenAPI = environment.functionUrl + '/api/v1/revoke_token';

    private basicAuth: string = 'Basic ' + window.btoa(environment.clientId + ':' + environment.secret);

    constructor(
        private http: HttpClient,
        private localStorage: LocalStorageService,
        private router: Router) {
    }

    getIsLoggedIn() {
        return this.localStorage.get('isLoggedIn');
    }

    storeUserDetail(user: any) {
        this.localStorage.set('userObject', user);
    }

    login() {
        let state = Utils.generateRandomString();
        this.localStorage.set('state', state);
        let scope = ['read', 'identity', 'history', 'vote', 'account', 'submit', 'subscribe', 'save', 'flair', 'mysubreddits'];
        let httParams = new HttpParams()
            .set('response_type', 'code')
            .set('duration', 'permanent')
            .set('redirect_uri', this.getRedirectUri())
            .set('state', state)
            .set('scope', scope.join(','));
        window.location.href = environment.loginUrl + '?' + httParams.toString();
    }

    loginAppOnly() {
        let body = new HttpParams().set('grant_type', 'client_credentials');
        return this.http.post(this.getAccessTokenAPI, body.toString(),
            {
                headers:
                {
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).pipe(tap(next => {
                this.localStorage.set('userToken', next['access_token']);
                this.localStorage.set('initTime', Date.now().toString());
            }));
    }

    logout() {
        this.localStorage.remove('userToken');
        this.localStorage.remove('refreshToken');
        this.localStorage.remove('userObject');
        this.localStorage.remove('state');
        this.localStorage.set('isLoggedIn', false);

        // Will improve this later 
        window.location.reload();
    }

    getBearerAPI(code: string) {
        let body = new HttpParams()
            .set('grant_type', 'authorization_code')
            .set('code', code)
            .set('redirect_uri', this.getRedirectUri());

        return this.http.post(this.getAccessTokenAPI, body.toString(),
            {
                headers:
                {
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).pipe(tap(next => {
                if (next['token_type'] === 'bearer') {
                    this.localStorage.set('userToken', next['access_token']);
                    this.localStorage.set('refreshToken', next['refresh_token']);
                    this.localStorage.set('initTime', Date.now().toString());
                    this.localStorage.set('isLoggedIn', true);
                }
            }));
    }

    refreshToken() {
        let body = new HttpParams()
            .set('grant_type', 'refresh_token')
            .set('refresh_token', this.localStorage.get('refreshToken'));

        return this.http.post(this.getAccessTokenAPI, body.toString(),
            {
                headers:
                {
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    }

    revokeToken() {
        let body = new HttpParams()
            .set('token', this.localStorage.get('refreshToken'))
            .set('token_type_hint', 'refresh_token');

        return this.http.post(this.getRevokeTokenAPI, body.toString(),
            {
                headers:
                {
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                observe: 'response'
            });
    }

    getUserInfo() {
        const url = HeadersUtils.buildUrl(ApiList.USER_INFO);
        return this.http.get(url);
    }

    getRedirectUri() {
        if (!this.redirectURI) {
            return environment.appURL + 'authenticate';
        }
        return this.redirectURI;
    }

    getToken() {
        if (this.localStorage.get('userToken')) {
            return 'Bearer ' + this.localStorage.get('userToken');
        }
        return '';
    }

}