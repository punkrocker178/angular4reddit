import { Component, Input } from '@angular/core';
import { Award } from 'src/app/model/post';

@Component({
    selector: 'app-award',
    templateUrl: './award.component.html'
})
export class AwardComponent {

    @Input() awards: Award[];
    @Input() isDetail: boolean;

    numberOfItems = 5;
    isShowAll = false;

    popoverConfig = {
        placement: 'bottom',
        modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 0],
              },
            },
          ],
    }

    constructor() {}

    getAwardIcon(award: Award, index: number): string {
      return award.resized_icons && award.resized_icons[index] ? award.resized_icons[index].url : award.icon_url; 
    }

    getNumbersRemain(): number {
        return this.awards.length - this.numberOfItems;
    }

    showAllAwards(): void {
        this.numberOfItems = this.awards.length;
        this.isShowAll = true;
    }
    
}