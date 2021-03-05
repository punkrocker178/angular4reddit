import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HeadersUtils } from '../class/HeadersUtils';
import { Utils } from '../class/Utils';
import { RedditAuthenticateService } from './reddit-authenticate.service';

@Injectable()
export class RedditSearchService {
    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService) { }

    endpoint = '/api/search_reddit_names';

    searchSubreddit(name: string) {

        if (name === '') {
            return of([]);
        }

        const payload = {
            exact: false,
            include_over_18: true,
            include_unadvertisable: true,
            query: name,
            typeahead_active: false
        }

        let params = new HttpParams();

        for (let prop in payload) {
            params = params.set(prop, payload[prop]);
        }

        return this.http.get(HeadersUtils.buildUrl(true, this.endpoint, false), {
            params: params,
            headers: {
                'Authorization': this.authenticateService.getToken()
            }
        }).pipe(map(response => {
            if(response && response['names'].length > 0) {
                return response['names'];
            } else {
                return [];
            }
        }));
    }

    searchSubmission() {

    }
}