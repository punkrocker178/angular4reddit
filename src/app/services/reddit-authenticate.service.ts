import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from './localStorage.service';
import { ApiList } from '../constants/api-list';
import { HeadersUtils } from '../class/HeadersUtils';
import { Utils } from '../class/Utils';

@Injectable()
export class RedditAuthenticateService {

    redirectURI: string;

    user = {
        name: '',
        karmar: ''
    }

    constructor(private http: HttpClient, private localStorage: LocalStorageService) { }

    getUser() {
        return this.user;
    }

    setUserValue(key: string, value: string) {
        this.user[key] = value
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
        .set('duration', 'temporary')
        .set('redirect_uri', this.getRedirectUri())
        .set('state', state)
        .set('scope', scope.join(','));
        
        window.location.href = environment.loginUrl + '?' + httParams.toString();
    }

    getBearerAPI(code: string) {

        let body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('code', code)
        .set('redirect_uri', this.getRedirectUri());

        let getAccessTokenAPI = environment.functionUrl + '/api/v1/access_token';
        let basicAuth = 'Basic ' + window.btoa(environment.clientId + ':' + environment.secret);
        return this.http.post(getAccessTokenAPI, body.toString(),
            { headers: 
                { 
                    'Authorization': basicAuth,
                    'Content-Type': 'application/x-www-form-urlencoded'
                } 
            });
    }

    getUserInfo() {
        const url = HeadersUtils.buildUrl(!!this.getToken(), ApiList.USER_INFO);

        const headers = HeadersUtils.buildHeaders({
            bearerToken: this.getToken()
        });

        return this.http.get(url, {headers: headers});
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