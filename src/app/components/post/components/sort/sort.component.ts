import { Component, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ApiList } from 'src/app/constants/api-list';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html',
    styleUrls: ['./sort.component.less']
})
export class SortComponent {

    sortTypes = [ApiList.LISTINGS_BEST_LABEL, ApiList.LISTINGS_HOT_LABEL, ApiList.LISTINGS_RISING_LABEL, ApiList.LISTINGS_NEW_LABEL];
    selectedValue =  ApiList.LISTINGS_HOT_LABEL;

    clickState: boolean;

    @Output() changeSort = new EventEmitter();

    constructor() {

    }

    ngOnInit() {
    }

    toggleDropdown(type?: string) {
      this.clickState = !this.clickState;
      if (type) {
        this.selectedValue = type;
        this.changeSort.emit(this.selectedValue);
      }
    }
}
