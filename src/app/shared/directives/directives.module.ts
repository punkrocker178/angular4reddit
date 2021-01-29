import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PopoverDirective } from "./popover/popover.directive";

@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        PopoverDirective
    ],
    exports: [
        PopoverDirective
    ]
  })
  export class SharedDirectivesModule { }