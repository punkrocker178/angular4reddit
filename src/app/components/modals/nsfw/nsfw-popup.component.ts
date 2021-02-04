import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { UserService } from "src/app/services/user.service";

@Component({
    selector: 'nsfw-popup',
    templateUrl: './nsfw-popup.component.html'
})


export class NsfwPopupComponent {
    @Input() input;

    constructor(public activeModal: NgbActiveModal,
        private userService: UserService) {}

    dismiss(reason: string) {
        this.activeModal.dismiss(reason);
    }

    close(result: string) {
        this.userService.updateNSFW(true);
        this.activeModal.close(result);
    }
}