import {Component, EventEmitter, Output} from "@angular/core";

@Component({
    selector: 'toggle-button',
    templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent {
    @Output() toggleState: EventEmitter<boolean> = new EventEmitter();

    state = false;

    toggle() {
        this.state = !this.state;
        this.toggleState.emit(this.state);
    }
}
