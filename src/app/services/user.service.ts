import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localStorage.service';
import { UserInterface } from '../model/user.interface';
import { HeadersUtils } from '../class/HeadersUtils';

@Injectable()
export class UserService {

    private preferencesAPI = '/api/v1/me/prefs';

    private allowNSFW: BehaviorSubject<boolean> = new BehaviorSubject(false);
    allowNSFW$ = this.allowNSFW.asObservable();

    private userSubject: BehaviorSubject<UserInterface> = new BehaviorSubject({
        name: 'anonymous'
    });

    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private localStorage: LocalStorageService) {

        const userObject = localStorage.get('userObject');

        if (userObject) {
            this.userSubject.next(userObject);
        }
    
        if (this.userSubject.getValue().over_18) {
            this.allowNSFW.next(this.userSubject.getValue().over_18);
        }
    }

    setUser(user) {
        this.userSubject.next(user);
    }

    getUser() {
        return this.userSubject.getValue();
    }

    getUserAbout(user) {
        const aboutAPI = `/u/${user}/about`;
        return this.http.get(HeadersUtils.buildUrl(aboutAPI),
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserOverview(user) {
        const overviewAPI = `/u/${user}/overview`;
        return this.http.get(HeadersUtils.buildUrl(overviewAPI),
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserComments(user) {
        const commentsAPI = `/u/${user}/comments`;
        return this.http.get(HeadersUtils.buildUrl(commentsAPI),
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    getUserPreference() {
        return this.http.get(HeadersUtils.buildUrl(this.preferencesAPI),
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    updateUserPreference(body) {
        return this.http.patch(HeadersUtils.buildUrl(this.preferencesAPI), body,
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken()
                }
            });
    }

    updateNSFW(flag: boolean) {
        if (this.authenticateService.getIsLoggedIn()) {
            const userPreferencePayload = this.getUpdateNSFWPayload(flag);
            this.updateUserPreference(userPreferencePayload).pipe(tap(next => {
                this.storeNSFW(next['over_18'], true);
            })).subscribe();
        } else {
            this.storeNSFW(flag);
        }

    }

    private storeNSFW(data, isLoggedIn?: boolean) {

        let value;
        let user = this.userSubject.getValue();
        if (isLoggedIn) {
            value = data['over_18'];
            user.over_18 = data['over_18'];
        } else {
            value = data;
            user.over_18 = data;
        }

        this.allowNSFW.next(value);
        this.localStorage.set('userObject', user);

    }

    getUpdateNSFWPayload(flag: boolean) {
        return {
            'over_18': flag,
            'search_include_over_18': flag
        }
    }

    isNSFWAllowed() {
        return this.allowNSFW.getValue();
    }
}