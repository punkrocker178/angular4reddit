import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HeadersUtils } from '../class/HeadersUtils';
import { catchError, map, tap } from 'rxjs/operators';
import { Listings } from '../model/listings.interface';
import { PostDetail } from '../model/post-detail';
import { Router } from '@angular/router';
import { Post } from '../model/post';

@Injectable()
export class RedditListingService {

    static MAX_POST_LIMIT = 100;
    static QUERY_LIMIT = 25;

    previousListingSubject = new BehaviorSubject<Post[]>([]);
    listingSubject = new BehaviorSubject<Listings>(null);
    visitedSubredditSubject = new BehaviorSubject<string>(null);
    visitedUserSubject = new BehaviorSubject<string>(null);

    constructor(
        private http: HttpClient,
        private router: Router) { }

    set visitedUser(user: string) {
            this.visitedUserSubject.next(user);
        }
    
    get visitedUser() {
            return this.visitedUserSubject.getValue();
        }

    set visitedSubreddit(subreddit: string) {
            this.visitedSubredditSubject.next(subreddit);
        }
    
    get visitedSubreddit() {
            return this.visitedSubredditSubject.getValue();
        }

    set listingStoredData(data) {
        this.listingSubject.next(data);
    }

    get listingStoredData() {
        return this.listingSubject.getValue();
    }

    get listingPreviousData() {
        return this.previousListingSubject.getValue();;
    }

    set listingPreviousData(data) {
        this.previousListingSubject.next(data);
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

            let listing: Listings = {
                after:'' ,
                children: [],
                kind: '',
            };
            if (this.listingSubject.getValue()) {
                listing = this.listingSubject.getValue();

                let children = listing.children;

                if (listing.children.length >= RedditListingService.MAX_POST_LIMIT) {
                    children = listing.children.slice(RedditListingService.QUERY_LIMIT);
                }

                listing.children = [...children, ...next.children];
            } else {
                listing.children = next.children;
            }

            listing.after = next.after;  
            listing.kind = next.kind;
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