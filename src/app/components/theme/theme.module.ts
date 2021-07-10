import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ThemeSelectorComponent } from "./components/theme-selector/theme-selector.component";

@NgModule({
    imports:[
        CommonModule
    ],
    declarations: [
        ThemeSelectorComponent
    ],
    exports: [
        ThemeSelectorComponent
    ]
  })
  export class ThemeModule { }