import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ParseHtmlDirective } from "./html/parse-html.directive";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ParseHtmlDirective
  ],
  exports: [
    ParseHtmlDirective
  ]
})
export class DirectivesModule { }
