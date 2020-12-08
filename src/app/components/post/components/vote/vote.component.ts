import { Component, Input } from '@angular/core';
import { VotingService } from 'src/app/services/vote.service';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html'
})
export class VoteComponent {

    @Input() score;
    @Input() id: string;
    @Input() liked: boolean;
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

        switch (direction) {
            case 1:
                if (this.isDownVoted) {
                    this.score += direction + 1;
                    this.votingService.vote(this.id, direction.toString()).subscribe();
                    this.isDownVoted = false;
                } else if (this.isUpVoted) {
                    this.score -= 1;
                    this.votingService.vote(this.id, '0').subscribe();
                } else {
                    this.score += direction;
                    this.votingService.vote(this.id, direction.toString()).subscribe();
                }

                this.isUpVoted = !this.isUpVoted;
                break;
            case -1:
                if (this.isUpVoted) {
                    this.score += direction - 1;
                    this.votingService.vote(this.id, direction.toString()).subscribe();
                    this.isUpVoted = false;
                } else if (this.isDownVoted) {
                    this.score += 1;
                    this.votingService.vote(this.id, '0').subscribe();
                } else {
                    this.score += direction;
                    this.votingService.vote(this.id, direction.toString()).subscribe();
                }

                this.isDownVoted = !this.isDownVoted;
                break;
        }

    }
}