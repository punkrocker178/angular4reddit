import { Component, input, linkedSignal, output } from '@angular/core';

@Component({
    selector: 'app-toggle-button',
    templateUrl: './toggle-button.component.html',
    standalone: false
})
export class ToggleButtonComponent {
    readonly state = input(false);
    readonly toggleState = output<boolean>();

    readonly checked = linkedSignal(() => this.state());

    toggle() {
        this.checked.update(s => !s);
        this.toggleState.emit(this.checked());
    }
}
