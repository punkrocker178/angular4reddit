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
    pushshiftSubmissionAPI = '/reddit/search/submission';

    searchSubreddit(data) {
        const payload = {
            q: data.name,
            show_users: true
        }

        if (data.limit) {
            payload['limit'] = data.limit;
        }

        if (data.after) {
            payload['after'] = data.after;
        }

        let params = new HttpParams();

        for (let prop in payload) {
            params = params.set(prop, payload[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(this.endpointSubreddit), {
            params: params
        }).pipe(map((response: any) => {
            if (response.data) {
                let subreddits = [];
                for (let i = 0; i < response.data.children.length; i++) {
                    const subreddit = response.data.children[i];
                    if (subreddit.kind === 't5') {
                        subreddits.push(subreddit);
                    }
                }
                return {
                    after: response.data.after,
                    children: subreddits
                };
            } else {
                return [];
            }
        }
        ));
    }

    searchSubredditNames(name: string, over18?: boolean) {

        if (name === '') {
            return of([]);
        }

        const payload = {
            exact: false,
            include_over_18: !!over18,
            include_unadvertisable: true,
            query: name,
            typeahead_active: false
        };

        let params = new HttpParams();

        for (let prop in payload) {
            params = params.set(prop, payload[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(this.endpointSubredditNames), {
            params: params
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

        return this.http.get(HeadersUtils.buildPushshiftUrl(this.pushshiftSubmissionAPI), {
            params: queryParams
        }).pipe(map((response: any) => response ? response.data : []));
    }
}