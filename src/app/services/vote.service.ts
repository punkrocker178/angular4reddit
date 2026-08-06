import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';


@Injectable()
export class VotingService {

    private voteAPI = environment.functionUrl + '/oauth/api/vote';
    constructor(private http: HttpClient) { }

    vote(fullname: string, dir: string) {
        let body = new HttpParams()
            .set('id', fullname)
            .set('dir', dir);

        const apiCall = this.http.post(this.voteAPI, body.toString(),
            {
                headers:
                {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).pipe(map(_ =>  true ));
        return apiCall;
    }
}