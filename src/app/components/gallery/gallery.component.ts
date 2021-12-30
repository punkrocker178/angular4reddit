import { AfterContentInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent implements OnInit, AfterContentInit {

    elementIndex = 0;
    positionClass: string;
    @ViewChild('gallery') galleryEl: ElementRef;
    childList = [];
    @Input() configs;

    constructor(private renderer2: Renderer2) {

    }

    ngOnInit() {
        this.positionClass = this.getPositionClass();
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.childList = this.galleryEl.nativeElement.children;
        });
    }

    next() {
        if (this.elementIndex < this.childList.length - 1) {
            this.changeIndex(1);
        }
    }

    previous() {
        if (this.elementIndex > 0) {
            this.changeIndex(-1);
        }
    }

    changeIndex(value) {
        const currEl = this.childList[this.elementIndex];
        this.renderer2.removeClass(currEl, 'active');

        this.elementIndex += value;

        const newEl = this.childList[this.elementIndex];
        this.renderer2.addClass(newEl, 'active');
    }

    getPositionClass() {
        let position;
        switch (this.configs.position) {
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
