import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { ApiList } from '../constants/api-list';
import { HeadersUtils } from '../class/HeadersUtils';
import { Utils } from '../class/Utils';
import { User } from '../model/user';
import { Router } from '@angular/router';

@Injectable()
export class RedditAuthenticateService {

    redirectURI: string;

    private user: User;
    private getAccessTokenAPI = environment.functionUrl + '/api/v1/access_token';
    private getRevokeTokenAPI = environment.functionUrl + '/api/v1/revoke_token';

    private basicAuth: string =  'Basic ' + window.btoa(environment.clientId + ':' + environment.secret);

    constructor(
        private http: HttpClient, 
        private localStorage: LocalStorageService,
        private router: Router) { 
        this.user = this.getUser();
    }

    getUser() {
        if (!this.user) {
            if (this.localStorage.get('userOject')){
                const userObj = this.localStorage.get('userOject');
                return new User(userObj['name'], User.getKarma(userObj));
            }
            return new User();
        }
        return this.user;
    }

    setUserValue(key: string, value: string) {
        this.getUser()[key] = value
    }

    storeUserDetail(user: any) {
        this.localStorage.set('userObject', user);
    }

    login() {
        let state = Utils.generateRandomString();
        this.localStorage.set('state', state);
        let scope = ['read', 'identity'];
        let httParams = new HttpParams()
        .set('response_type', 'code')
        .set('duration', 'permanent')
        .set('redirect_uri', this.getRedirectUri())
        .set('state', state)
        .set('scope', scope.join(','));
        
        window.location.href = environment.loginUrl + '?' + httParams.toString();
    }

    logout() {
        this.localStorage.remove('userToken');
        this.localStorage.remove('refreshToken');
        this.localStorage.remove('userObject');
        this.user = null;
        this.router.navigateByUrl('/home');
    }

    getBearerAPI(code: string) {

        let body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', this.getRedirectUri());
        
        return this.http.post(this.getAccessTokenAPI, body.toString(),
            { headers: 
                { 
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                } 
            });
    }

    refreshToken() {
        let body = new HttpParams()
        .set('grant_type', 'refresh_token')
        .set('refresh_token', this.localStorage.get('refreshToken'));

        return this.http.post(this.getAccessTokenAPI, body.toString(),
            { headers: 
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
            { headers: 
                { 
                    'Authorization': this.basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
              observe: 'response' 
            });
    }

    getUserInfo() {
        const url = HeadersUtils.buildUrl(!!this.getToken(), ApiList.USER_INFO);
        return this.http.get(url);
    }

    getRedirectUri() {
        if (!this.redirectURI) {
            return environment.appURL + 'authenticate';
        }
        return this.redirectURI;
    }

    getToken() {
        if(this.localStorage.get('userToken')) {
            return 'Bearer ' + this.localStorage.get('userToken');
        }
        return false;
    }

}