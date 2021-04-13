import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HeadersUtils } from '../class/HeadersUtils';
import { TrumbowygConstants } from '../constants/trymbowyg-constants';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { TrumbowygService } from './trumbowyg.service';

@Injectable()
export class RedditSubmitService {
    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private trumbowygService: TrumbowygService) { }


    comment(data): Observable<Object> {
        const payload = this.commentPayload(data.thingID, data.content);
        return this.submitComment(payload);
    }

    commentPayload(parent: string, content: string) {
        return {
            api_type: 'json',
            text: content,
            thing_id: parent,
            return_rtjson: true
        }
    }

    submitComment(payload): Observable<Object> {
        let body = new HttpParams();
        for (const field in payload) {
            body = body.set(field, payload[field]);
        }

        return this.http.post(HeadersUtils.buildUrl('/api/comment'), body.toString(),
            {
                headers:
                {
                    'Authorization': this.authenticateService.getToken(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).pipe(tap(_ => this.trumbowygService.clearPostEditor()));
    }
}