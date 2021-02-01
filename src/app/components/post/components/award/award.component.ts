import { Component, Input, Output } from '@angular/core';

@Component({
    selector: 'app-award',
    templateUrl: './award.component.html'
})
export class AwardComponent {

    @Input() awards;

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

    getNumbersRemain() {
        return this.awards.length - this.numberOfItems;
    }

    showAllAwards() {
        this.numberOfItems = this.awards.length;
        this.isShowAll = true;
    }
    
}