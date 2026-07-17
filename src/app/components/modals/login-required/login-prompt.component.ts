import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { interval, Subject } from "rxjs";
import { take, takeUntil, tap } from "rxjs/operators";
import { RedditAuthenticateService } from "src/app/services/reddit-authenticate.service";

@Component({
    selector: 'app-login-prompt',
    templateUrl: './login-promt.component.html'
})

export class LoginPromptComponent {
    timer: number | null = null;
    dismiss$ = new Subject<void>();
    countDownSeconds = 5;
    countDownInterval = interval(1000);

    constructor(public activeModal: NgbActiveModal,
                private authenService: RedditAuthenticateService) {}

    dismiss(reason: string) {
        this.dismiss$.next();
        this.dismiss$.complete();
        this.activeModal.dismiss(reason);
    }

    close(result: string) {
        this.countDownInterval.pipe(
            take(this.countDownSeconds), 
            takeUntil(this.dismiss$), 
            tap(next => {
            this.timer = this.countDownSeconds - next - 1;
            if (this.timer !== null && this.timer === 0) {
                this.activeModal.close(result);
                this.authenService.login();
            }
        })).subscribe();
    }
}
