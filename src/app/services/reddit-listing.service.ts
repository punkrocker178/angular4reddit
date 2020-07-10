import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { environment } from 'src/environments/environment';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { HeadersUtils } from '../class/Headers';

@Injectable()
export class RedditListingService {

    constructor(private http: HttpClient, private authenticateService: RedditAuthenticateService) { }

    getListigs(segment: string, params?: any): Observable<Object> {
        let headers = HeadersUtils.buildHeaders(
            {
                bearerToken: this.authenticateService.getToken()
            }
        );
        const options = {
            headers: headers,
            params: params
        }

        let url = '';
        
        if (this.authenticateService.getToken()) {
            url = this.buildUrl('/oauth' + segment);
        } else {
            url = this.buildUrl(segment, true);
        }

        let data = this.http.get(url, options);
        return data;
    }

    buildUrl(segment: string, requestJson?: boolean) {
        return environment.functionUrl + segment + (requestJson ? '/.json' : '');
    }
}