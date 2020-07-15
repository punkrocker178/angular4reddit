import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LocalStorageService } from '../services/localStorage.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

    oauthRegex = /\/oauth/;

    constructor(private localStorage: LocalStorageService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });

        if (!this.isValidRequestToIntercept(req.url, req.headers.get('skip'))) {
            next.handle(req);
        }

        if (this.isExpiredToken()) {
            throw new Error("");
        }

        const token = this.localStorage.get('accessToken');

        if (token) {
            req = req.clone({
                headers: req.headers.set('Authorization', 'Bearer ' + token)
            });
        }

        return next.handle(req);
    }

    isValidRequestToIntercept(url: string, skip) {
        if (!this.oauthRegex.test(url) || skip) {
            return false;
        }
        return true;
    }

    isExpiredToken() {
        return Math.floor((Date.now()/1000) - (this.localStorage.get('initTime')/1000)) > 3599;
    }

}