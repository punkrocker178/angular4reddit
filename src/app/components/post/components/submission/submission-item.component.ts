import { Component, Input, OnInit } from '@angular/core';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'submission-item',
    templateUrl: './submission-item.component.html'
})

export class SubmissionItemComponent implements OnInit {

    subredddit: string;

    @Input() submissionData;

    constructor(private checkDeviceFeature: CheckDeviceFeatureService) { }

    ngOnInit() {
        this.submissionData.title = ReplacePipe.prototype.transform(this.submissionData.title);
        this.subredddit = ReplacePipe.prototype.transform(this.submissionData['permalink'], /\/comments\/[A-Za-z0-9/_-]*/);

        this.formatThumbnail();
    }

    formatThumbnail() {
        if (this.submissionData['thumbnail'] && !this.submissionData['thumbnail'].includes('https://')) {
            this.submissionData['thumbnail'] = '';
        }
    }

    isMobile() {
        return this.checkDeviceFeature.isMobile();
    }

    viewDetail() {

    }

}
