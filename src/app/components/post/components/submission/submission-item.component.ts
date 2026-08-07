import { Component, OnInit, input } from '@angular/core';
import { PostData } from 'src/app/model/post';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'submission-item',
    templateUrl: './submission-item.component.html',
    standalone: false
})

export class SubmissionItemComponent implements OnInit {

    subredddit: string;

    readonly submissionData = input<PostData>(undefined);

    constructor(private checkDeviceFeature: CheckDeviceFeatureService) { }

    ngOnInit() {
        const submissionData = this.submissionData();
        if (!submissionData) {
            return;
        }

        submissionData.title = ReplacePipe.prototype.transform(submissionData.title);
        this.subredddit = ReplacePipe.prototype.transform(submissionData['permalink'], /\/comments\/[A-Za-z0-9/_-]*/);

        this.formatThumbnail();
    }

    formatThumbnail() {
        const submissionData = this.submissionData();
        if (submissionData?.['thumbnail'] && !submissionData['thumbnail'].includes('https://')) {
            submissionData['thumbnail'] = '';
        }
    }

    isMobile() {
        return this.checkDeviceFeature.isMobile();
    }

    viewDetail() {

    }

}
