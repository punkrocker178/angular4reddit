import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { LocalStorageService } from './localStorage.service';
import { UserInterface } from '../model/user.interface';
import { HeadersUtils } from '../class/HeadersUtils';

@Injectable()
export class UserService {

    private preferencesAPI = '/api/v1/me/prefs';

    private allowNSFW: BehaviorSubject<boolean> = new BehaviorSubject(false);
    allowNSFW$ = this.allowNSFW.asObservable();

    private userSubject: BehaviorSubject<UserInterface> = new BehaviorSubject({
        name: 'redditor',
        icon_img: '/assets/images/snoo-profile.png',
        is_login: false
    } as UserInterface);

    public user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private localStorage: LocalStorageService) {

        const userObject = localStorage.get('userObject') as UserInterface;

        if (userObject) {
            this.userSubject.next(userObject);
        }

        if (userObject && userObject.over_18) {
            this.allowNSFW.next(userObject.over_18);
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
        return this.http.get(HeadersUtils.buildUrl(aboutAPI));
    }

    getUserOverview(user) {
        const overviewAPI = `/u/${user}/overview`;
        return this.http.get(HeadersUtils.buildUrl(overviewAPI));
    }

    getUserComments(user) {
        const commentsAPI = `/u/${user}/comments`;
        return this.http.get(HeadersUtils.buildUrl(commentsAPI));
    }

    getUserPreference() {
        return this.http.get(HeadersUtils.buildUrl(this.preferencesAPI));
    }

    updateUserPreference(body: any): Observable<UserInterface> {
        return this.http.patch<UserInterface>(HeadersUtils.buildUrl(this.preferencesAPI), body);
    }

    updateNSFW(flag: boolean): Observable<never> {
        if (this.authenticateService.getIsLoggedIn()) {
            const userPreferencePayload = this.getUpdateNSFWPayload(flag);
            return this.updateUserPreference(userPreferencePayload).pipe(
              tap((next: UserInterface) => {
                this.storeNSFW(next.over_18 || false);
              }),
              mergeMap(() => EMPTY)
          );
        } else {
            this.storeNSFW(flag);
            return EMPTY;
        }

    }

    private storeNSFW(value: boolean) {
        let user = this.userSubject.getValue();
        user.over_18 = value;
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
