import { Component, Input, OnInit } from '@angular/core';
import { VotingService } from 'src/app/services/vote.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html'
})
export class VoteComponent implements OnInit {

    @Input() score;
    @Input() id: string;
    @Input() liked: boolean;
    @Input() isCompactView: boolean;
    isUpVoted = false;
    isDownVoted = false;

    constructor(private votingService: VotingService) {

    }

    ngOnInit() {
        if (this.liked != null) {
            this.isUpVoted = this.liked;
            this.isDownVoted = !this.liked;
        }
    }

    vote(direction: number) {

        let undo;
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
