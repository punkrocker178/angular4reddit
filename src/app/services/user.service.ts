import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LocalStorageService } from './localStorage.service';
import { UserInterface } from '../model/user.interface';
import { HeadersUtils } from '../class/HeadersUtils';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';

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

    updateUserPreference(body) {
        return this.http.patch(HeadersUtils.buildUrl(this.preferencesAPI), body);
    }

    updateNSFW(flag: boolean): Observable<any> {
        if (this.authenticateService.getIsLoggedIn()) {
            const userPreferencePayload = this.getUpdateNSFWPayload(flag);
            return this.updateUserPreference(userPreferencePayload).pipe(tap((next: UserInterface) => {
                console.log(next.over_18);
                this.storeNSFW(next.over_18);
            }));
        } else {
            this.storeNSFW(flag);
            return of(flag);
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