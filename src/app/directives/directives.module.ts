import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MarkdownDirective } from './markdown.directive';

@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        MarkdownDirective
    ],
    exports: [
        MarkdownDirective
    ]
  })
  export class DirectivesModule { }