/** 
 * 
 *  Code is heavily referenced from https://dev-academy.com/angular-jwt 
 * 
 *  **/

import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap, filter, take } from 'rxjs/operators';
import { LocalStorageService } from '../services/localStorage.service';
import { RedditAuthenticateService } from '../services/reddit-authenticate.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    oauthRegex = /\/oauth/;
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(
        private localStorage: LocalStorageService,
        private authenService: RedditAuthenticateService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!req.headers.get('Content-Type')) {
            req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
        }
        
        if (!this.isValidRequestToIntercept(req.url, req.headers.get('skip'))) {
            return next.handle(req);
        }

        if (this.isExpiredToken()) {
            console.log(this.localStorage.get('initTime'));
            return this.handle401Error(req, next);
        }

        const token = this.localStorage.get('userToken');
        
        if (token) {
            req = this.setToken(req, token);
        }

        return next.handle(req).pipe(
            catchError(error => {

                if (error.status === 404) {
                    return this.handle404Error(error);
                }

                if (error.status === 401) {
                    return this.handle401Error(req, next);
                }

                if (error.error == 'unsupported_grant_type') {
                    this.authenService.revokeToken();
                }
            })
        );
    }

    isValidRequestToIntercept(url: string, skip) {
        if (!this.oauthRegex.test(url) || skip) {
            return false;
        }
        return true;
    }

    isExpiredToken() {
        return Math.floor((Date.now() / 1000) - (this.localStorage.get('initTime') / 1000)) > 3599;
    }

    setToken(request: HttpRequest<any>, token) {
        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
    }

    handle404Error(error) {
        let err=  error.error;
        if (err == null) {
            err = {
                status: 404,
                message: '[HttpInterceptor] Not Found'
            }
        }

        return throwError(err);
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            
            let authOb = switchMap((res: any) => {
                this.isRefreshing = false; 
                this.refreshTokenSubject.next(res.access_token);
                req = req.clone({
                    headers: req.headers.set('Authorization', 'Bearer ' + res.access_token)
                });
                this.localStorage.set('initTime', Date.now().toString());
                this.localStorage.set('userToken', res.access_token);
                return next.handle(req);
            });

            if (this.authenService.getIsLoggedIn()) {
                return this.authenService.refreshToken().pipe(authOb);
            } else {
                return this.authenService.loginAppOnly().pipe(authOb);
            }
            
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token => {
                    return next.handle(this.setToken(req, token))
                })
            );
        }
    }
}