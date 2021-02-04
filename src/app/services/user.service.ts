import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localStorage.service';
import { UserInterface } from '../model/user.interface';

@Injectable()
export class UserService {

    private path = environment.functionUrl + '/oauth';
    private preferencesAPI = 'api/v1/me/prefs';

    private allowNSFW: BehaviorSubject<boolean> = new BehaviorSubject(false);
    allowNSFW$ = this.allowNSFW.asObservable();

    private user: UserInterface;

    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private localStorage: LocalStorageService) {

        const userObject = localStorage.get('userObject');
        this.user = userObject;

        if (this.user.over_18) {
            this.allowNSFW.next(this.user.over_18);
        }

    }

    getUserAbout(user) {
        const aboutAPI = `${this.path}/u/${user}/about`;
        return this.http.get(aboutAPI,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserOverview(user) {
        const aboutAPI = `${this.path}/u/${user}/overview`;
        return this.http.get(aboutAPI,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserComments(user) {
        const aboutAPI = `${this.path}/u/${user}/comments`;
        return this.http.get(aboutAPI,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserPreference() {
        return this.http.get(this.preferencesAPI,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    updateUserPreference(body) {
        return this.http.patch(this.preferencesAPI, body,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    updateNSFW(flag: boolean) {
        const userPreferencePayload = this.getUpdateNSFWPayload(flag);
        this.updateUserPreference(userPreferencePayload).pipe(tap(next => {
            this.allowNSFW.next(next['over_18']);
            this.user.over_18 = next['over_18'];
            this.localStorage.set('userObject', this.user);
        })).subscribe();
    }

    getUpdateNSFWPayload(flag: boolean) {
        return {
            'over_18': flag,
            'search_include_over_18': flag
        }
    }

    isNSFWAllowed() {
        console.log('2');
        return this.allowNSFW.getValue();
    }
}