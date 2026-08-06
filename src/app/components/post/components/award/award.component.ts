import { Component, input } from '@angular/core';
import { Award } from 'src/app/model/post';

@Component({
    selector: 'app-award',
    templateUrl: './award.component.html',
    standalone: false
})
export class AwardComponent {

    readonly awards = input<Award[]>(undefined);
    readonly isDetail = input<boolean>(undefined);

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
        return this.awards().length - this.numberOfItems;
    }

    showAllAwards(): void {
        this.numberOfItems = this.awards().length;
        this.isShowAll = true;
    }
    
}