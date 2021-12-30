import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { interval, Subject } from "rxjs";
import { take, takeUntil, tap } from "rxjs/operators";
import { RedditAuthenticateService } from "src/app/services/reddit-authenticate.service";

@Component({
    selector: 'app-login-prompt',
    templateUrl: './login-promt.component.html'
})

export class LoginPromptComponent {
    @Input() input;

    timer;
    dismiss$ = new Subject<void>();

    constructor(public activeModal: NgbActiveModal,
                private authenService: RedditAuthenticateService) {}

    dismiss(reason: string) {
        this.dismiss$.next();
        this.dismiss$.complete();
        this.activeModal.dismiss(reason);
    }

    close(result: string) {
        const counter = interval(1000);
        const seconds = 5;

        counter.pipe(take(seconds), takeUntil(this.dismiss$), tap(next => {
            this.timer = seconds - next - 1;
            console.log(this.timer);
            if (this.timer === 0) {
                this.activeModal.close(result);
                this.authenService.login();
            }
        })).subscribe();
    }
}
