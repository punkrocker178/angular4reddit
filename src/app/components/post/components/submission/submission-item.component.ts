import { Component, computed, effect, input } from '@angular/core';
import { PostData } from 'src/app/model/post';
import { ReplacePipe } from 'src/app/pipe/replace.pipe';
import { CheckDeviceFeatureService } from 'src/app/services/check-device-feature.service';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'submission-item',
    templateUrl: './submission-item.component.html',
    standalone: false
})

export class SubmissionItemComponent {

    readonly submissionData = input<PostData>(undefined);

    readonly displayTitle = computed(() => {
        const data = this.submissionData();
        if (!data?.title) {
            return '';
        }
        return ReplacePipe.prototype.transform(data.title);
    });

    readonly subredddit = computed(() => {
        const data = this.submissionData();
        if (!data) {
            return '';
        }
        return ReplacePipe.prototype.transform(data['permalink'], /\/comments\/[A-Za-z0-9/_-]*/);
    });

    constructor(private checkDeviceFeature: CheckDeviceFeatureService) {
        effect(() => {
            const data = this.submissionData();
            if (data?.['thumbnail'] && !data['thumbnail'].includes('https://')) {
                data['thumbnail'] = '';
            }
        });
    }

    isMobile() {
        return this.checkDeviceFeature.isMobile();
    }

    viewDetail() {

    }

}
