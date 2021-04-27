import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { RedditAuthenticateService } from './reddit-authenticate.service';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginPromptComponent } from '../components/modals/login-required/login-prompt.component';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { from, of } from 'rxjs';


@Injectable()
export class VotingService {

    private voteAPI = environment.functionUrl + '/oauth/api/vote';
    constructor(private http: HttpClient,
        private authenticateService: RedditAuthenticateService,
        private modalService: NgbModal) { }

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

        if (!this.authenticateService.getIsLoggedIn()) {
            const modal = this.modalService.open(LoginPromptComponent);

            return from(modal.result.then(result => false))
            .pipe(
                take(1),
                switchMap(value =>  of(value))
                );
        }

        return apiCall;
    }
}