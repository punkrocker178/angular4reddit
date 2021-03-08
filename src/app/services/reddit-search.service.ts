import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeadersUtils } from '../class/HeadersUtils';
import { RedditAuthenticateService } from './reddit-authenticate.service';

@Injectable()
export class RedditSearchService {
    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService) { }

    endpointSubredditNames = '/api/search_reddit_names';
    endpointSubreddit = '/subreddits/search';

    /* https://github.com/pushshift/api */
    pushshiftSubmissionAPI = '/pushshift/reddit/search/submission';

    searchSubreddit(name: string, limit?: number) {
        const payload = {
            q: name,
            show_users: true
        }

        if (limit) {
            payload['limit'] = limit;
        }

        let params = new HttpParams();

        for (let prop in payload) {
            params = params.set(prop, payload[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(true, this.endpointSubreddit, false), {
            params: params,
            headers: {
                'Authorization': this.authenticateService.getToken()
            }
        }).pipe(map((response: any) => {
            if (response.data) {
                let subreddits = [];
                for (let i = 0; i < response.data.children.length; i++) {
                    const subreddit = response.data.children[i];
                    if (subreddit.kind === 't5') {
                        subreddits.push(subreddit);
                    }
                }
                return subreddits;
            } else {
                return [];
            }
        }
        ));
    }

    searchSubredditNames(name: string) {

        if (name === '') {
            return of([]);
        }

        const payload = {
            exact: false,
            include_over_18: true,
            include_unadvertisable: true,
            query: name,
            typeahead_active: false
        };

        let params = new HttpParams();

        for (let prop in payload) {
            params = params.set(prop, payload[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(true, this.endpointSubredditNames, false), {
            params: params,
            headers: {
                'Authorization': this.authenticateService.getToken()
            }
        }).pipe(map(response => {
            if (response && response['names'].length > 0) {
                return response['names'];
            } else {
                return [];
            }
        }));
    }

    searchSubmission(params) {
        let queryParams = new HttpParams();
        for (let prop in params) {
            queryParams = queryParams.set(prop, params[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(false, this.pushshiftSubmissionAPI, false), {
            params: queryParams
        }).pipe(map((response: any) => response ? response.data : []));
    }
}