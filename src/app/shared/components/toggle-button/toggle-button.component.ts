import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html'
})
export class ToggleButtonComponent {
    @Output() toggleState: EventEmitter<boolean> = new EventEmitter();

    @Input() state;

    toggle() {
        this.state = !this.state;
        this.toggleState.emit(this.state);
    }
}
