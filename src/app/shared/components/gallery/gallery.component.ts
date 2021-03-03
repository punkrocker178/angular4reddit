import { Component, Input } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent {

    index = 0;
    source: string;
    positionClass: string;
    @Input() configs;
    @Input() data;

    constructor() {

    }

    ngOnInit() {
        this.source = this.configs ? this.configs.src : null;
        this.positionClass = this.getPositionClass();
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

    getPositionClass() {
        let position;
        switch(this.configs.position) {
            case 'top-right':
                position = 'image-number-top-right';
                break;
            case 'bottom-right':
                position = 'image-number-bottom-right';
                break;
            case 'bottom-left':
                position = 'image-number-bottom-left';
                break;
            default:
                position = 'image-number-top-left';
                break;
        }
        return position;
    }
    }