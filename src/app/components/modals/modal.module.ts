import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { LoginPromptComponent } from "./login-required/login-prompt.component";
import { NsfwPopupComponent } from "./nsfw/nsfw-popup.component";

@NgModule({
    imports:[
        CommonModule,
        BrowserModule,
        NgbModalModule
    ],
    declarations: [
        LoginPromptComponent,
        NsfwPopupComponent
    ],
    exports: [
        LoginPromptComponent,
        NsfwPopupComponent
    ]
  })
  export class ModalModule { }