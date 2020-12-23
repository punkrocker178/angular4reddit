import { Component, Input } from '@angular/core';
import { ApiList } from 'src/app/constants/api-list';

@Component({
    selector: 'app-sort',
    templateUrl: './sort.component.html'
})
export class SortComponent {

    sortCategories = [ApiList.LISTINGS_BEST_LABEL, ApiList.LISTINGS_HOT_LABEL, ApiList.LISTINGS_RISING_LABEL, ApiList.LISTINGS_NEW_LABEL]

    constructor() {

    }

    ngOnInit() {
        console.log(this.sortCategories);
    }

}