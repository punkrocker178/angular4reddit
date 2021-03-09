import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'app-award',
    templateUrl: './award.component.html'
})
export class AwardComponent {

    @Input() awards;
    @Input() isDetail;

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

    getAwardIcon(award, index) {
      return award['resized_icons'] && award['resized_icons'][index] ? award['resized_icons'][index].url : award['icon_url']; 
    }

    getNumbersRemain() {
        return this.awards.length - this.numberOfItems;
    }

    showAllAwards() {
        this.numberOfItems = this.awards.length;
        this.isShowAll = true;
    }
    
}