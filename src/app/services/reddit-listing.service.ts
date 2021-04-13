import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { HeadersUtils } from '../class/HeadersUtils';
import { catchError, map } from 'rxjs/operators';
import { Listings } from '../model/listings';
import { PostDetail } from '../model/post-detail';
import { Router } from '@angular/router';

@Injectable()
export class RedditListingService {

    constructor(
        private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private router: Router) { }

    getListigs(segment: string, params?: any): Observable<Listings> {

        const options = {
            params: params
        }

        let url = HeadersUtils.buildUrl(segment);

        let ob = this.http.get(url, options);
        return ob.pipe(map((data: any) => {
            return {
                kind: data.kind,
                after: data.data.after,
                children: data.data.children
            }
        }));
    }

    getPostDetail(path, params?: any): Observable<PostDetail> {
        const options = {
            params: params
        }

        let url = HeadersUtils.buildUrl(path);

        let ob = this.http.get(url, options);
        return ob.pipe(map((data: any) => {
            return {
                detail: data[0].data.children[0],
                comments: data[1].data.children
            }
            }),
            catchError(error => {
                this.router.navigateByUrl('404');
                return throwError(error);
            }
        ));
    }

}