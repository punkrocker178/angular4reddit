import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginPromptComponent } from 'src/app/components/modals/login-required/login-prompt.component';
import { RedditAuthenticateService } from 'src/app/services/reddit-authenticate.service';
import { VotingService } from 'src/app/services/vote.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html'
})
export class VoteComponent implements OnInit {

    @Input() score: number;
    @Input() id: string;
    @Input() liked: boolean;
    @Input() isCompactView: boolean;
    isUpVoted = false;
    isDownVoted = false;

    constructor(
        private votingService: VotingService,
        private authenticateService: RedditAuthenticateService,
        private modalService: NgbModal
    ) {

    }

    ngOnInit() {
        if (this.liked != null) {
            this.isUpVoted = this.liked;
            this.isDownVoted = !this.liked;
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
                    this.score += direction + 1;
                    this.isDownVoted = false;
                } else if (this.isUpVoted) {
                    this.score -= 1;
                    undo = true;
                } else {
                    this.score += direction;
                }
                this.isUpVoted = !this.isUpVoted;
                break;
            case -1:
                if (this.isUpVoted) {
                    this.score += direction - 1;
                    this.isUpVoted = false;
                } else if (this.isDownVoted) {
                    this.score += 1;
                    undo = true;
                } else {
                    this.score += direction;
                }
                this.isDownVoted = !this.isDownVoted;
                break;
        }

        this.votingService.vote(this.id,undo ? '0' : direction.toString()).subscribe();

    }
}
