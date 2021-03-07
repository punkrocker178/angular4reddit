import { Component, Input } from '@angular/core';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';

@Component({
    selector: 'submission-item',
    templateUrl: './submission-item.component.html'
})

export class SubmissionItemComponent {

    subredddit: string;

    @Input() submissionData;

    constructor() { }

    ngOnInit() {
        this.subredddit = ReplacePipe.prototype.transform(this.submissionData['permalink'], /\/comments\/[A-Za-z0-9/_-]*/);

        this.formatThumbnail();
    }

    formatThumbnail() {
        if (this.submissionData['thumbnail'] && !this.submissionData['thumbnail'].includes('https://')) {
            this.submissionData['thumbnail'] = '';
        }
    }

}