import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent {

    index = 0;
    source: string;
    @Input() configs;
    @Input() data;

    constructor() {

    }

    ngOnInit() {
        this.source = this.configs ? this.configs.src : null;
    }

    next() {
        if (this.index < this.data.items.length - 1) {
            this.index += 1;
        }
    }

    previous() {
        if (this.index > 0) {
            this.index -= 1;
        }
    }
}