import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class RedditAuthenticateService {

    constructor(private http: HttpClient) { }

    login() {
        window.location.href = environment.loginUrl + '&state=string&redirect_uri=' + environment.appURL + '&duration=temporary&scope=read'; 
    }
}