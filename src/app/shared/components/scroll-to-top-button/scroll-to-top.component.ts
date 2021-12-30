import {Component, Input} from "@angular/core";

@Component({
    selector: 'app-scroll-top-button',
    templateUrl: './scroll-to-top.component.html'
})
export class ScrollToTopComponent {
    @Input() targetElementId: string;

    scroll() {
        document.getElementById(this.targetElementId).scrollIntoView();
    }
}
