import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';
import { HeadersUtils } from '../class/HeadersUtils';

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
}