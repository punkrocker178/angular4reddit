import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HeadersUtils } from '../class/HeadersUtils';
import { catchError, map, tap } from 'rxjs/operators';
import { Listings } from '../model/listings.interface';
import { PostDetail } from '../model/post-detail';
import { Router } from '@angular/router';
import { Post } from '../model/post';
import { MAX_POST_LIMIT, QUERY_LIMIT } from '../constants/constants';
import { QueryRequest } from '../model/query-request';

interface RedditListingApiResponse {
  kind: string;
  data: {
    after: string;
    children: Post[];
  };
}

interface RedditPostDetailApiResponse {
  data: {
    children: Post[];
  };
}

@Injectable()
export class RedditListingService {
    previousListingSubject = new BehaviorSubject<Post[]>([]);
    listingSubject = new BehaviorSubject<Listings | null>(null);
    visitedSubredditSubject = new BehaviorSubject<string | null>(null);
    visitedUserSubject = new BehaviorSubject<string | null>(null);

    constructor(
        private http: HttpClient,
        private router: Router) { }

    set visitedUser(user: string) {
            this.visitedUserSubject.next(user);
        }

    get visitedUser(): string | null {
            return this.visitedUserSubject.getValue();
        }

    set visitedSubreddit(subreddit: string) {
            this.visitedSubredditSubject.next(subreddit);
        }

    get visitedSubreddit(): string | null {
            return this.visitedSubredditSubject.getValue();
        }

    set listingStoredData(data: Listings | null) {
        this.listingSubject.next(data);
    }

    get listingStoredData() {
        return this.listingSubject.getValue();
    }

    get listingPreviousData() {
        return this.previousListingSubject.getValue();
    }

    set listingPreviousData(data: Post[]) {
        this.previousListingSubject.next(data);
    }

    getListigs(segment: string, queryParams?: QueryRequest): Observable<Listings> {
        let params = new HttpParams();
        if (queryParams?.limit !== undefined) {
            params = params.set('limit', queryParams.limit);
        }
        if (queryParams?.after) {
            params = params.set('after', queryParams.after);
        }

        const url = HeadersUtils.buildUrl(segment);
        return this.http.get<RedditListingApiResponse>(url, { params }).pipe(
            map((data: RedditListingApiResponse) => ({
                kind: data.kind,
                after: data.data.after,
                children: data.data.children
            })),
            // Store/Cache data
            tap((next: Listings) => {
                let listing: Listings = {
                    after: '',
                    children: [],
                    kind: '',
                };
                if (this.listingSubject.getValue()) {
                    listing = this.listingSubject.getValue()!;

                    let children = listing.children;

                    if (listing.children.length >= MAX_POST_LIMIT) {
                        children = listing.children.slice(QUERY_LIMIT);
                    }

                    listing.children = [...children, ...next.children];
                } else {
                    listing.children = next.children;
                }

                listing.after = next.after;
                listing.kind = next.kind;
                this.listingSubject.next(listing);
            })
        );
    }

    getPostDetail(path: string, queryParams?: QueryRequest): Observable<PostDetail> {
        let params = new HttpParams();
        if (queryParams?.limit !== undefined) {
            params = params.set('limit', queryParams.limit);
        }
        if (queryParams?.after) {
            params = params.set('after', queryParams.after);
        }

        const url = HeadersUtils.buildUrl(path);
        return this.http.get<RedditPostDetailApiResponse[]>(url, { params }).pipe(
            map((data: RedditPostDetailApiResponse[]) => ({
                detail: data[0].data.children[0],
                comments: data[1].data.children
            })),
            catchError(error => {
                this.router.navigateByUrl('404');
                return throwError(error);
            })
        );
    }

    savePost(postId: string) {
        const body = new HttpParams().set('id', postId);
        const url = HeadersUtils.buildUrl('/api/save');
        return this.http.post(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

    unsavePost(postId: string) {
        const body = new HttpParams().set('id', postId);
        const url = HeadersUtils.buildUrl('/api/unsave');
        return this.http.post(url, body.toString(), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    }

}
