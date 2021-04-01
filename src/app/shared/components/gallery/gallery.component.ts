import { Component, ElementRef, Input, QueryList, Renderer2, ViewChildren } from '@angular/core';
declare var $: any;

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html'
})
export class GalleryComponent {

    elementIndex = 0;
    source: string;
    positionClass: string;
    @ViewChildren('item') galleryItems: QueryList<ElementRef>;
    @Input() configs;
    @Input() data;

    constructor(private renderer2: Renderer2) {

    }

    ngOnInit() {
        this.source = this.configs ? this.configs.src : null;
        this.positionClass = this.getPositionClass();
    }

    next() {
        if (this.elementIndex < this.data.items.length - 1) {
            const currEl = this.galleryItems.toArray()[this.elementIndex].nativeElement;
            this.renderer2.removeClass(currEl, 'active');
            
            this.elementIndex += 1;

            const newEl = this.galleryItems.toArray()[this.elementIndex].nativeElement;
            this.renderer2.addClass(newEl, 'active');
        }
    }

    previous() {
        if (this.elementIndex > 0) {
            
            const currEl = this.galleryItems.toArray()[this.elementIndex].nativeElement;
            this.renderer2.removeClass(currEl, 'active');
            
            this.elementIndex -= 1;

            const newEl = this.galleryItems.toArray()[this.elementIndex].nativeElement;
            this.renderer2.addClass(newEl, 'active');
            
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