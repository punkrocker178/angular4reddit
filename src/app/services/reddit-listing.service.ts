import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { HeadersUtils } from '../class/HeadersUtils';
import { catchError, map, tap } from 'rxjs/operators';
import { Listings } from '../model/listings';
import { PostDetail } from '../model/post-detail';
import { Router } from '@angular/router';

@Injectable()
export class RedditListingService {

    listingSubject = new BehaviorSubject<Listings>(null);

    constructor(
        private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private router: Router) { }

    set listingStoredData(data) {
        this.listingSubject.next(data);
    }

    get listingStoredData() {
        return this.listingSubject.getValue();
    }

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
        }), 
        // Store/Cache data
        tap((next: Listings) => {
            let listing: Listings;
            if (this.listingSubject.getValue()) {
                listing = this.listingSubject.getValue();
                listing.children = [...listing.children, ...next.children];
            } else {
                listing = new Listings();
                listing.children = next.children;
            }

            listing.after = next.after;  
            this.listingSubject.next(listing);
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

    savePost(postId: string) {
        const body = new HttpParams().set('id', postId);
        const url = HeadersUtils.buildUrl('/api/save');
        return this.http.post(url, body.toString(),{
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

    unsavePost(postId: string) {
        const body = new HttpParams().set('id', postId);
        const url = HeadersUtils.buildUrl('/api/unsave');
        return this.http.post(url, body.toString(),{
            headers:
            {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }

}