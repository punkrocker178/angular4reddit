import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ApiList } from 'src/app/constants/api-list';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html'
})
export class SortComponent {

    sortCategories = [ApiList.LISTINGS_BEST_LABEL, ApiList.LISTINGS_HOT_LABEL, ApiList.LISTINGS_RISING_LABEL, ApiList.LISTINGS_NEW_LABEL];
    selectedValue =  ApiList.LISTINGS_HOT_LABEL;

    @Output() changeSort = new EventEmitter();

    constructor() {

    }

    ngOnInit() {
    }

    change() {
        this.changeSort.emit(this.selectedValue);
    }
}