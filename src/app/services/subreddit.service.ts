import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';
import { HeadersUtils } from '../class/HeadersUtils';
import { Observable } from 'rxjs';
import { Listings } from '../model/listings.interface';
import { map } from 'rxjs/operators';

@Injectable()
export class SubredditService {

    private path = environment.functionUrl + '/oauth/';
    constructor(private http: HttpClient,
                private authenticateService: RedditAuthenticateService) { }

    getSubredditAbout(subbreddit) {
        const aboutAPI = `${this.path}${subbreddit}/about`;
        return this.http.get(aboutAPI);
    }

    subscribeSubreddit(action: string, fullname: string) {
        let payload = {
            action: action,
            action_source: 'o',
            sr: fullname
        }

        let body = new HttpParams();
        for (const field in payload) {
            body = body.set(field, payload[field]);
        }

        return this.http.post(HeadersUtils.buildUrl('/api/subscribe'), body.toString(),
            {
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
    }

    searchInSubreddit(term, subreddit, after?, sort?): Observable<Listings> {
        let payload = {
            q: term,
            restrict_sr: true,
        }

        if (after) {
            payload['after'] = after;
        }

        if (sort) {
            payload['sort'] = sort
        }

        let param = new HttpParams();
        for (const field in payload) {
            param = param.set(field, payload[field]);
        }

        return this.http.get(HeadersUtils.buildUrl(`/r/${subreddit}/search`), {
            params: param
        }).pipe(map((data: any) => {
            return {
                kind: data.kind,
                after: data.data.after,
                children: data.data.children
            }
        }));
    }

    getSubredditRules(subreddit) {
        return this.http.get(HeadersUtils.buildUrl(`/r/${subreddit}/about/rules`));
    }
}