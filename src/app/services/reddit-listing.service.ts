import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { environment } from 'src/environments/environment';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { HeadersUtils } from '../class/HeadersUtils';

@Injectable()
export class RedditListingService {

    constructor(private http: HttpClient, private authenticateService: RedditAuthenticateService) { }

    getListigs(segment: string, params?: any): Observable<Object> {

        const options = {
            params: params
        }

        let url = HeadersUtils.buildUrl(!!this.authenticateService.getToken(), segment, true);

        let data = this.http.get(url, options);
        return data;
    }

}