import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from 'src/app/model/post';
import { environment } from 'src/environments/environment';

@Injectable()
export class RedditListingService {

    constructor(private http: HttpClient) { }

    getListigs(segment: string, params?: any): Observable<Object> {
        let optionParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach((key) => {
                optionParams.append(key, params[key]); 
             });
        }
        
        const options = {
            params: optionParams ? optionParams : undefined
        }

        let data = this.http.get(environment.functionUrl + segment + '/.json', options);
        return data;
    }
}