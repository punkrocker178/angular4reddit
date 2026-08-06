import { Component, input, output } from '@angular/core';

import { ApiList } from 'src/app/constants/api-list';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.less'],
    standalone: false
})
export class SortComponent {

  sortTypes = [ApiList.LISTINGS_BEST_LABEL, ApiList.LISTINGS_HOT_LABEL, ApiList.LISTINGS_RISING_LABEL, ApiList.LISTINGS_NEW_LABEL];
  selectedValue = ApiList.LISTINGS_HOT_LABEL;
  currentFeed = ApiList.LISTINGS_MY_FEED;

  clickState: boolean;

  readonly showFeed = input<boolean>(undefined);
  readonly changeSort = output<string>();
  readonly changeFeedEmitter = output<string>();

  constructor() {

  }

  toggleDropdown(type?: string) {
    this.clickState = !this.clickState;
    if (type) {
      this.selectedValue = type;
      this.changeSort.emit(this.selectedValue);
    }
  }

  changeFeed(type: string) {
    if (type !== this.currentFeed) {
      this.currentFeed = type;
      switch (this.currentFeed) {
        case ApiList.LISTINGS_ALL:
          this.changeFeedEmitter.emit(ApiList.LISTINGS_ALL);
          break;
        case ApiList.LISTINGS_MY_FEED:
          this.changeFeedEmitter.emit(ApiList.LISTINGS_HOT_LABEL);
          break;
      }
    }
  }
}
