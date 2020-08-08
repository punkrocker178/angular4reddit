import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { HeadersUtils } from '../class/HeadersUtils';
import { map } from 'rxjs/operators';
import { Listings } from '../model/listings';

@Injectable()
export class RedditListingService {

    constructor(private http: HttpClient, private authenticateService: RedditAuthenticateService) { }

    getListigs(segment: string, params?: any): Observable<Listings> {
        
        const options = {
            params: params
        }

        let url = HeadersUtils.buildUrl(!!this.authenticateService.getToken(), segment, true);

        let data = this.http.get(url, options);
        return data.pipe(map((data: any) => {
            return {
                kind: data.kind,
                after: data.data.after,
                children: data.data.children
            }
        }));
    }

}