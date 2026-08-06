import {Component, input} from "@angular/core";

@Component({
    selector: 'app-scroll-top-button',
    templateUrl: './scroll-to-top.component.html',
    standalone: false
})
export class ScrollToTopComponent {
    readonly targetElementId = input<string>(undefined);

    scroll() {
        document.getElementById(this.targetElementId()).scrollIntoView();
    }
}
