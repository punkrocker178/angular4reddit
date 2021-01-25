import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {

    private path = environment.functionUrl + '/oauth/u';
    constructor(private http: HttpClient,
                private authenticateService: RedditAuthenticateService) { }

    getUserAbout(user) {
        const aboutAPI = `${this.path}/${user}/about`;
        return this.http.get(aboutAPI,
            { headers: 
                { 
                    'Authorization': this.authenticateService.getToken()
                } 
            });
    }

    getUserOverview(user) {
        const aboutAPI = `${this.path}/${user}/overview`;
        return this.http.get(aboutAPI,
            { headers: 
                { 
                    'Authorization': this.authenticateService.getToken()
                } 
            });
    }

    getUserComments(user) {
        const aboutAPI = `${this.path}/${user}/comments`;
        return this.http.get(aboutAPI,
            { headers: 
                { 
                    'Authorization': this.authenticateService.getToken()
                } 
            });
    }
}