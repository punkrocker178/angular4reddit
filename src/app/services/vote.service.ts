import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class VotingService {

    private voteAPI = environment.functionUrl + '/oauth/api/vote';
    constructor(private http: HttpClient,
                private authenticateService: RedditAuthenticateService) { }

    vote(fullname: string, dir: string) {
        let body = new HttpParams()
        .set('id', fullname)
        .set('dir', dir);
        
        return this.http.post(this.voteAPI, body.toString(),
            { headers: 
                { 
                    'Authorization': this.authenticateService.getToken(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                } 
            });
    }

    voting(direction) {
        
    }
}