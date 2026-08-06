import { Component, OnInit, input, linkedSignal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginPromptComponent } from 'src/app/components/modals/login-required/login-prompt.component';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { VotingService } from 'src/app/services/vote.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    standalone: false
})
export class VoteComponent implements OnInit {

    readonly score = input<number>(0);
    readonly id = input<string>(undefined);
    readonly liked = input<boolean | null>(undefined);
    readonly isCompactView = input<boolean>(false);

    /** Local optimistic score; resyncs when the input score changes. */
    readonly currentScore = linkedSignal(() => this.score() ?? 0);

    isUpVoted = false;
    isDownVoted = false;

    constructor(
        private votingService: VotingService,
        private authenticateService: RedditAuthenticateService,
        private modalService: NgbModal
    ) {

    }

    ngOnInit() {
        if (this.liked() != null) {
            this.isUpVoted = !!this.liked();
            this.isDownVoted = !this.liked();
        }
    }

    vote(direction: number) {
         if (!this.authenticateService.getIsLoggedIn()) {
            this.modalService.open(LoginPromptComponent);
            return;
        }

        let undo: boolean;

        switch (direction) {
            case 1:
                if (this.isDownVoted) {
                    this.currentScore.update(s => s + direction + 1);
                    this.isDownVoted = false;
                } else if (this.isUpVoted) {
                    this.currentScore.update(s => s - 1);
                    undo = true;
                } else {
                    this.currentScore.update(s => s + direction);
                }
                this.isUpVoted = !this.isUpVoted;
                break;
            case -1:
                if (this.isUpVoted) {
                    this.currentScore.update(s => s + direction - 1);
                    this.isUpVoted = false;
                } else if (this.isDownVoted) {
                    this.currentScore.update(s => s + 1);
                    undo = true;
                } else {
                    this.currentScore.update(s => s + direction);
                }
                this.isDownVoted = !this.isDownVoted;
                break;
        }

        this.votingService.vote(this.id(),undo ? '0' : direction.toString()).subscribe();

    }
}
