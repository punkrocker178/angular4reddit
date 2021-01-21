import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SubredditService {

    private path = environment.functionUrl + '/oauth/';
    constructor(private http: HttpClient,
                private authenticateService: RedditAuthenticateService) { }

    getSubredditAbout(subbreddit) {
        const aboutAPI = `${this.path}${subbreddit}/about`;
        return this.http.get(aboutAPI,
            { headers: 
                { 
                    'Authorization': this.authenticateService.getToken()
                } 
            });
    }
}