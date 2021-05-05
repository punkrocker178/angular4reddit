import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ParseHtmlDirective } from "./html/parse-html.directive";
import { MarkdownDirective } from './markdown/markdown.directive';

@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        MarkdownDirective,
        ParseHtmlDirective
    ],
    exports: [
        MarkdownDirective,
        ParseHtmlDirective
    ]
  })
  export class DirectivesModule { }