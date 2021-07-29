import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'scroll-top-button',
    templateUrl: './scroll-to-top.component.html'
})
export class ScrollToTopComponent {
    @Input() targetElementId: string;

    scroll() {
        document.getElementById(this.targetElementId).scrollIntoView();
    }
}
